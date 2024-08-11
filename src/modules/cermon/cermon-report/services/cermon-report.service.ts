import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReportIbadahDto } from '../dto/create-report-ibadah.dto';
import { UpdateReportIbadahDto } from '../dto/update-report-ibadah.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CermonReportEntity } from '../entities/cermon-report.entity';
import { FilterReportDto } from '../dto/filter.dto';
import { RegionService } from '../../../region/services/region.service';
import { CermonReportRepository } from '../repository/cermon-report.repository';
import { JadwalIbadahService } from '../../cermon-schedule/services/jadwal-ibadah.service';

@Injectable()
export class ReportIbadahService {
  constructor(
    @InjectRepository(CermonReportEntity)
    private readonly reportRepository: Repository<CermonReportEntity>,
    private readonly customReportRepository: CermonReportRepository,
    private readonly cermonService: JadwalIbadahService,
    private readonly regionService: RegionService,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateReportIbadahDto) {
    const cermon = await this.cermonService.getOne(dto.cermon_id);
    if (!cermon) throw new BadRequestException('cermon is not found!');

    const isExist = await this.reportRepository.findOne({
      where: { cermon_id: cermon.unique_id, date: new Date(dto.date) },
    });
    if (isExist) throw new BadRequestException('data report already exist');

    const createReport = this.reportRepository.create({
      date: new Date(dto.date),
      total_male: dto.total_male,
      total_female: dto.total_female,
      total_new_male: dto.total_new_male,
      total_new_female: dto.total_new_female,
      cermon: cermon,
      region_id: cermon.region_id,
    });

    await this.reportRepository.save(createReport);
  }

  async getDashboardData(dto: FilterReportDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: dto?.region_id });
    dto.region_ids = regions.map((data) => data.id);

    const averageThisMonth = await this.customReportRepository.getAverageMonthly(dto);
    const averageLastMonth = await this.customReportRepository.getAverageLastMonth(dto);

    const devider = Number(averageLastMonth?.average) ? Number(averageLastMonth?.average) : 1;

    let percentage = ((Number(averageThisMonth?.average) - Number(averageLastMonth?.average)) / devider) * 100;
    return {
      total: Math.round(Number(averageThisMonth?.average)),
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  async findAll(dto: FilterReportDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: dto?.region_id });
    dto.region_ids = regions.map((data) => data.id);

    if (dto.cermon_id) {
      const cermon = await this.cermonService.getOne(dto.cermon_id);
      if (!cermon) throw new BadRequestException('cermon is not found!');
      dto.cermon_unique_id = cermon.unique_id;
    }

    try {
      const result = await this.customReportRepository.getAll(dto);
      return result;
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException();
    }
  }

  findOne(id: number, region_id?: number) {
    return this.customReportRepository.getOne(id);
  }

  async update(id: number, dto: UpdateReportIbadahDto) {
    const report = await this.findOne(id);
    if (!report) throw new BadRequestException('report is not found!');

    const cermon = await this.cermonService.getOne(dto.cermon_id);
    if (!cermon) throw new BadRequestException('cermon is not found!');

    const isExist = await this.reportRepository.findOne({
      where: { cermon_id: cermon.unique_id, date: new Date(dto.date) },
    });
    if (isExist && isExist.id !== report.id) throw new BadRequestException('data report already exist');

    this.reportRepository.save({
      ...report,
      ...dto,
      date: new Date(dto.date),
      cermon: cermon,
      region_id: cermon.region_id,
    });
  }

  async remove(id: number, region_id?: number) {
    const report = await this.findOne(id, region_id);
    if (!report) throw new BadRequestException('report is not found!');

    this.reportRepository.remove(report);
  }

  async upload(listData: Partial<CermonReportEntity>[], cermon_ids?: string[]) {
    const batchSize = 1000; // Define the batch size
    const totalBatches = Math.ceil(listData.length / batchSize);
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      let batch = listData.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

      for (const bc of batch) {
        if (!cermon_ids?.includes(bc.cermon_id)) throw new BadRequestException('not valid cermon_id in file');
      }

      try {
        await this.dataSource.transaction(async (manager) => {
          await manager
            .createQueryBuilder()
            .insert()
            .into(CermonReportEntity)
            .values(batch)
            .orUpdate(['total_male', 'total_female', 'total_new_male', 'total_new_female'], ['date', 'cermon_id'])
            .execute();
        });
      } catch (error) {
        console.log({ error });
        throw new BadRequestException('data can not be uploaded');
      }
    }
  }

  async getReportByRegion(filter: any) {
    return this.customReportRepository.getReportByRegion(filter);
  }

  async export(cermon_ids?: number[]) {
    try {
      const result = await this.customReportRepository.getExport(cermon_ids);

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
