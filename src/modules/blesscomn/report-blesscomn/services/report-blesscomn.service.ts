import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportBlesscomnDto } from '../dto/create-report-blesscomn.dto';
import { UpdateReportBlesscomnDto } from '../dto/update-report-blesscomn.dto';
import { ReportBlesscomnRepository } from '../repository/report-blesscomn.repository';
import { FilterDto } from '../dto/filter.dto';
import { BlesscomnService } from '../../../../modules/blesscomn/blesscomn/services/blesscomn.service';
import { ReportBlesscomnEntity } from '../entities/report-blesscomn.entity';
import { DataSource } from 'typeorm';
import { RegionService } from '../../../region/services/region.service';

@Injectable()
export class ReportBlesscomnService {
  constructor(
    private readonly reportBlesscomnRepository: ReportBlesscomnRepository,
    private readonly blesscomnService: BlesscomnService,
    private readonly regionService: RegionService,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateReportBlesscomnDto) {
    const blesscomn = await this.blesscomnService.findOne(dto.blesscomn_id);
    if (!blesscomn) throw new BadRequestException('Blesscomn is not found!');
    dto.blesscomn = blesscomn;

    const isDataExist = await this.reportBlesscomnRepository.findOne({
      where: { date: new Date(dto.date), blesscomn: { id: dto.blesscomn_id } },
    });
    if (isDataExist) throw new BadRequestException(`data already exist at [${new Date(dto.date).toDateString()}]`);

    const reportBlesscomn = this.reportBlesscomnRepository.create({
      ...dto,
      date: new Date(dto.date),
      blesscomn_id: blesscomn.unique_id,
      new: dto.new_male + dto.new_female,
      total: dto.total_female + dto.total_male + dto.new_male + dto.new_female,
    });

    return this.reportBlesscomnRepository.save(reportBlesscomn);
  }

  findAll(filter: FilterDto) {
    return this.reportBlesscomnRepository.getAll(filter);
  }

  findOne(id: number) {
    return this.reportBlesscomnRepository.getOne(id);
  }

  async chart(filter: FilterDto) {}

  async update(id: number, dto: UpdateReportBlesscomnDto) {
    const lastDataBlesscomn = await this.findOne(id);
    if (!lastDataBlesscomn) throw new BadRequestException('Blesscomn report is not found!');

    if (dto.blesscomn_id) {
      const blesscomn = await this.blesscomnService.findOne(dto.blesscomn_id);
      if (!blesscomn) throw new BadRequestException('Blesscomn is not found!');
      dto.blesscomn = blesscomn;
    }

    if (dto.date) {
      const isDataExist = await this.reportBlesscomnRepository.findOne({
        where: { date: dto.date, blesscomn: { id: dto.blesscomn_id } },
      });
      if (isDataExist && isDataExist.id != id) throw new BadRequestException('data already exist!');
    }

    dto.total_female = dto.total_female ?? lastDataBlesscomn.total_female;
    dto.total_male = dto.total_male ?? lastDataBlesscomn.total_male;
    dto.new_female = dto.new_female ?? lastDataBlesscomn.new_female;
    dto.new_male = dto.new_male ?? lastDataBlesscomn.new_male;
    dto.total = dto.total_female + dto.total_male + dto.new_female + dto.new_male;
    dto.new = dto.new_female + dto.new_male;

    await this.reportBlesscomnRepository.save({
      ...lastDataBlesscomn,
      ...dto,
      date: new Date(dto.date),
    });

    return { id };
  }

  async remove(id: number) {
    const lastDataBlesscomn = await this.findOne(id);
    if (!lastDataBlesscomn) throw new BadRequestException('Blesscomn report is not found!');

    await this.reportBlesscomnRepository.remove(lastDataBlesscomn);

    return { id };
  }

  async upload(listData: Partial<ReportBlesscomnEntity>[], blesscomn_ids?: string[]) {
    const batchSize = 1000; // Define the batch size
    const totalBatches = Math.ceil(listData.length / batchSize);
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      let batch = listData.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

      for (const bc of batch) {
        if (!blesscomn_ids?.includes(bc.blesscomn_id)) throw new BadRequestException('not valid blesscomn_id in file');
      }

      try {
        await this.dataSource.transaction(async (manager) => {
          await manager
            .createQueryBuilder()
            .insert()
            .into(ReportBlesscomnEntity)
            .values(batch)
            .orUpdate(
              ['total_male', 'total_female', 'new_male', 'new_female', 'total', 'new'],
              ['date', 'blesscomn_id'],
            )
            .execute();
        });
      } catch (error) {
        console.log({ error });
        throw new BadRequestException('data can not be uploaded');
      }
    }
  }

  async export(blesscomn_ids?: number[]) {
    return this.reportBlesscomnRepository.getExport(blesscomn_ids);
  }

  async getDashboardData(dto: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: dto?.region_id });
    dto.region_ids = regions.map((data) => data.id);

    const averageThisMonth = await this.reportBlesscomnRepository.getAverageMonthly(dto);
    const averageLastMonth = await this.reportBlesscomnRepository.getAverageLastMonth(dto);

    const devider = Number(averageLastMonth?.average) ? Number(averageLastMonth?.average) : 1;

    let percentage = ((Number(averageThisMonth?.average) - Number(averageLastMonth?.average)) / devider) * 100;
    return {
      total: Math.round(Number(averageThisMonth?.average)),
      percentage: Math.round(percentage * 100) / 100,
    };
  }
}
