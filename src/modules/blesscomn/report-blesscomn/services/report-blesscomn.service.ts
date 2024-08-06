import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportBlesscomnDto } from '../dto/create-report-blesscomn.dto';
import { UpdateReportBlesscomnDto } from '../dto/update-report-blesscomn.dto';
import { ReportBlesscomnRepository } from '../repository/report-blesscomn.repository';
import { FilterDto } from '../dto/filter.dto';
import { BlesscomnService } from '../../../../modules/blesscomn/blesscomn/services/blesscomn.service';
import { BlesscomnDto } from '../../blesscomn/dto/blesscomn.dto';
import { ReportBlesscomnEntity } from '../entities/report-blesscomn.entity';
import { DataSource, DeepPartial, In } from 'typeorm';

@Injectable()
export class ReportBlesscomnService {
  constructor(
    private readonly reportBlesscomnRepository: ReportBlesscomnRepository,
    private readonly blesscomnService: BlesscomnService,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateReportBlesscomnDto) {
    const blesscomn = await this.blesscomnService.findOne(dto.blesscomn_id);
    if (!blesscomn) throw new BadRequestException('Blesscomn is not found!');
    dto.blesscomn = blesscomn;

    const isDataExist = await this.reportBlesscomnRepository.findOne({
      where: { date: dto.date, blesscomn: { id: dto.blesscomn_id } },
    });
    if (isDataExist) throw new BadRequestException('data already exist!');

    const reportBlesscomn = this.reportBlesscomnRepository.create({
      ...dto,
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

  async chart(filter: FilterDto) {
    // const { entities: data } = await this.findAll(filter);
    // // Group data by month
    // const groupedData = data.reduce((acc, data) => {
    //   const month = new Date(data.date).getMonth();
    //   if (!acc[month]) {
    //     acc[month] = [];
    //   }
    //   acc[month].push({
    //     total: data.total,
    //     male: data.total_male,
    //     female: data.total_female,
    //     new: data.new,
    //   });
    //   return acc;
    // }, {});
    // // Calculate the average for each month
    // const averagePerMonth = Object.keys(groupedData).map((month) => {
    //   const values = groupedData[month];
    //   const averageTotal = values.reduce((sum, value) => sum + value.total, 0) / values.length;
    //   const averageMale = values.reduce((sum, value) => sum + value.male, 0) / values.length;
    //   const averageFemale = values.reduce((sum, value) => sum + value.female, 0) / values.length;
    //   const averageNew = values.reduce((sum, value) => sum + value.new, 0) / values.length;
    //   return {
    //     month,
    //     averageTotal,
    //     averageMale,
    //     averageFemale,
    //     averageNew,
    //   };
    // });
    // return averagePerMonth;
  }

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
    });

    return { id };
  }

  async remove(id: number) {
    const lastDataBlesscomn = await this.findOne(id);
    if (!lastDataBlesscomn) throw new BadRequestException('Blesscomn report is not found!');

    await this.reportBlesscomnRepository.softRemove(lastDataBlesscomn);

    return { id };
  }

  async upload(listData: Partial<ReportBlesscomnEntity>[], blesscomn_ids?: number[]) {
    const batchSize = 1000; // Define the batch size
    const totalBatches = Math.ceil(listData.length / batchSize);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      let batch = listData.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

      for (const bc of batch) {
        if (blesscomn_ids.includes(bc.blesscomn_id)) throw new BadRequestException('not valid blesscomn_id in file');
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
        throw new BadRequestException('data can not be uploaded');
      }
    }
  }

  async export(blesscomn_ids?: number[]) {
    return this.reportBlesscomnRepository.find({
      where: { blesscomn_id: In(blesscomn_ids) },
      select: {
        blesscomn_id: true,
        date: true,
        total_male: true,
        total_female: true,
        new_male: true,
        new_female: true,
        total: true,
        new: true,
      },
    });
  }
}
