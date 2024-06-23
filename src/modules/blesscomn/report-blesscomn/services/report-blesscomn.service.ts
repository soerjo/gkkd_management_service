import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportBlesscomnDto } from '../dto/create-report-blesscomn.dto';
import { UpdateReportBlesscomnDto } from '../dto/update-report-blesscomn.dto';
import { ReportBlesscomnRepository } from '../repository/report-blesscomn.repository';
import { FilterDto } from '../dto/filter.dto';
import { BlesscomnService } from 'src/modules/blesscomn/blesscomn/services/blesscomn.service';

@Injectable()
export class ReportBlesscomnService {
  constructor(
    private readonly reportBlesscomnRepository: ReportBlesscomnRepository,
    private readonly blesscomnService: BlesscomnService,
  ) {}

  async create(createReportBlesscomnDto: CreateReportBlesscomnDto) {
    const isDataExist = await this.reportBlesscomnRepository.findOne({
      where: { date: createReportBlesscomnDto.date, blesscomn: { id: createReportBlesscomnDto.blesscomn_id } },
    });
    if (isDataExist) throw new BadRequestException('data already exist!');

    const blesscomn = await this.blesscomnService.findOne(createReportBlesscomnDto.blesscomn_id);
    if (!blesscomn) throw new BadRequestException('Blesscomn is not found!');
    createReportBlesscomnDto.blesscomn = blesscomn;

    const reportBlesscomn = this.reportBlesscomnRepository.create({
      ...createReportBlesscomnDto,
      total: createReportBlesscomnDto.total_female + createReportBlesscomnDto.total_male,
    });

    return this.reportBlesscomnRepository.save(reportBlesscomn);
  }

  findAll(filter: FilterDto) {
    return this.reportBlesscomnRepository.getAll(filter);
  }

  findOne(id: number) {
    return this.reportBlesscomnRepository.findOneBy({ id });
  }

  async chart(filter: FilterDto) {
    const { entities: data } = await this.findAll(filter);

    // Group data by month
    const groupedData = data.reduce((acc, data) => {
      const month = new Date(data.date).getMonth();
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push({
        total: data.total,
        male: data.total_male,
        female: data.total_female,
        new: data.new,
      });
      return acc;
    }, {});

    // Calculate the average for each month
    const averagePerMonth = Object.keys(groupedData).map((month) => {
      const values = groupedData[month];

      const averageTotal = values.reduce((sum, value) => sum + value.total, 0) / values.length;
      const averageMale = values.reduce((sum, value) => sum + value.male, 0) / values.length;
      const averageFemale = values.reduce((sum, value) => sum + value.female, 0) / values.length;
      const averageNew = values.reduce((sum, value) => sum + value.new, 0) / values.length;

      return {
        month,
        averageTotal,
        averageMale,
        averageFemale,
        averageNew,
      };
    });

    return averagePerMonth;
  }

  async update(id: number, updateReportBlesscomnDto: UpdateReportBlesscomnDto) {
    const pastReportBlesscomn = await this.findOne(id);
    if (!pastReportBlesscomn) throw new BadRequestException('Blesscomn report is not found!');

    if (updateReportBlesscomnDto.blesscomn_id) {
      const blesscomn = await this.blesscomnService.findOne(updateReportBlesscomnDto.blesscomn_id);
      if (!blesscomn) throw new BadRequestException('Blesscomn is not found!');
      updateReportBlesscomnDto.blesscomn = blesscomn;
    }

    if (updateReportBlesscomnDto.date) {
      const isDataExist = await this.reportBlesscomnRepository.findOne({
        where: { date: updateReportBlesscomnDto.date, blesscomn: { id: updateReportBlesscomnDto.blesscomn_id } },
      });
      if (isDataExist && isDataExist.id != id) throw new BadRequestException('data already exist!');
    }

    if (updateReportBlesscomnDto.total_female || updateReportBlesscomnDto.total_male) {
      updateReportBlesscomnDto.total_female = updateReportBlesscomnDto.total_female ?? pastReportBlesscomn.total_female;
      updateReportBlesscomnDto.total_male = updateReportBlesscomnDto.total_male ?? pastReportBlesscomn.total_male;
      updateReportBlesscomnDto.total = updateReportBlesscomnDto.total_female + updateReportBlesscomnDto.total_male;
    }

    await this.reportBlesscomnRepository.save({
      ...pastReportBlesscomn,
      ...updateReportBlesscomnDto,
    });

    return { id };
  }

  async remove(id: number) {
    const pastReportBlesscomn = await this.findOne(id);
    if (!pastReportBlesscomn) throw new BadRequestException('Blesscomn report is not found!');

    await this.reportBlesscomnRepository.softRemove(pastReportBlesscomn);

    return { id };
  }
}
