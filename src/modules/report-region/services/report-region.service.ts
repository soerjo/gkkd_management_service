import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportRegionDto } from '../dto/create-report-region.dto';
import { UpdateReportRegionDto } from '../dto/update-report-region.dto';
import { ReportRegionRepository } from '../repository/report-region.repository';
import { FilterDto } from '../dto/filter.dto';
import { IsNull } from 'typeorm';
import { SundayServiceService } from 'src/modules/sunday-service/services/sunday-service.service';

@Injectable()
export class ReportRegionService {
  constructor(
    private readonly reportRegionRepository: ReportRegionRepository,
    private readonly sundayService: SundayServiceService,
  ) {}

  async create(createReportRegionDto: CreateReportRegionDto) {
    const isDataExist = await this.reportRegionRepository.findOne({
      where: { date: createReportRegionDto.date, sunday_service: { id: createReportRegionDto.sunday_service_id } },
    });
    if (isDataExist) throw new BadRequestException({ message: 'data already exist!' });

    const region = await this.sundayService.getOneById(createReportRegionDto.sunday_service_id);
    if (!region) throw new BadRequestException({ message: 'Region is not found!' });
    createReportRegionDto.sunday_service = region;

    const reportRegion = this.reportRegionRepository.create({
      ...createReportRegionDto,
      total: createReportRegionDto.total_female + createReportRegionDto.total_male,
    });

    return this.reportRegionRepository.save(reportRegion);
  }

  findAll(filter: FilterDto) {
    return this.reportRegionRepository.getAll(filter);
  }

  findOne(id: number) {
    return this.reportRegionRepository.findOneBy({ id: id ?? IsNull() });
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

  async update(id: number, updateReportRegionDto: UpdateReportRegionDto) {
    const pastReportRegion = await this.findOne(id);
    if (!pastReportRegion) throw new BadRequestException({ message: 'region report is not found!' });

    if (updateReportRegionDto.sunday_service_id) {
      const region = await this.sundayService.getOneById(updateReportRegionDto.sunday_service_id);
      if (!region) throw new BadRequestException({ message: 'Region is not found!' });
      updateReportRegionDto.sunday_service = region;
    }

    if (updateReportRegionDto.date) {
      const isDataExist = await this.reportRegionRepository.findOne({
        where: { date: updateReportRegionDto.date, sunday_service: { id: updateReportRegionDto.sunday_service_id } },
      });
      if (isDataExist && isDataExist.id != id) throw new BadRequestException({ message: 'data already exist!' });
    }

    if (updateReportRegionDto.total_female || updateReportRegionDto.total_male) {
      updateReportRegionDto.total_female = updateReportRegionDto.total_female ?? pastReportRegion.total_female;
      updateReportRegionDto.total_male = updateReportRegionDto.total_male ?? pastReportRegion.total_male;
      updateReportRegionDto.total = updateReportRegionDto.total_female + updateReportRegionDto.total_male;
    }

    await this.reportRegionRepository.save({
      ...pastReportRegion,
      ...updateReportRegionDto,
    });

    return { id };
  }

  async remove(id: number) {
    const pastReportRegion = await this.findOne(id);
    if (!pastReportRegion) throw new BadRequestException({ message: 'region report is not found!' });

    await this.reportRegionRepository.softRemove(pastReportRegion);

    return { id };
  }
}
