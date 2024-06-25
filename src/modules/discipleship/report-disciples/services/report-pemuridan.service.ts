import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportPemuridanDto } from '../dto/create-report-pemuridan.dto';
import { UpdateReportPemuridanDto } from '../dto/update-report-pemuridan.dto';
import { ReportPemuridanRepository } from '../repository/report-pemuridan.repository';
import { FilterDto } from '../dto/filter.dto';
import { IsNull } from 'typeorm';
import { getWeeksInMonth } from 'src/utils/week-in-month.utils';
import { PemuridanStatusEnum } from 'src/common/constant/pemuridan-status.constant';
import { DisciplesService } from '../../disciples/services/disciples.service';

@Injectable()
export class ReportPemuridanService {
  constructor(
    private readonly reportPemuridanRepository: ReportPemuridanRepository,
    private readonly pemuridanService: DisciplesService,
  ) {}

  async create(createReportPemuridanDto: CreateReportPemuridanDto) {
    const isDataExist = await this.reportPemuridanRepository.findOne({
      where: {
        date: createReportPemuridanDto.date,
        // pemuridan: { id: createReportPemuridanDto.pemuridan_id }
      },
    });
    if (isDataExist) throw new BadRequestException('data already exist!');

    const pemuridan = await this.pemuridanService.findOne(createReportPemuridanDto.pemuridan_id);
    if (!pemuridan) throw new BadRequestException('Pemuridan is not found!');
    // createReportPemuridanDto.pemuridan = pemuridan;

    const reportPemuridan = this.reportPemuridanRepository.create(createReportPemuridanDto);
    return this.reportPemuridanRepository.save(reportPemuridan);
  }

  findAll(filter: FilterDto) {
    return this.reportPemuridanRepository.getAll(filter);
  }

  findOne(id: number) {
    return this.reportPemuridanRepository.findOneBy({ id: id ?? IsNull() });
  }

  async update(id: number, updateReportPemuridanDto: UpdateReportPemuridanDto) {
    const pastReportPemuridan = await this.findOne(id);
    if (!pastReportPemuridan) throw new BadRequestException('Pemuridan report is not found!');

    if (updateReportPemuridanDto.pemuridan_id) {
      const pemuridan = await this.pemuridanService.findOne(updateReportPemuridanDto.pemuridan_id);
      if (!pemuridan) throw new BadRequestException('Pemuridan is not found!');
      // updateReportPemuridanDto.pemuridan = pemuridan;
    }

    await this.reportPemuridanRepository.save({
      ...pastReportPemuridan,
      ...updateReportPemuridanDto,
    });

    return { id };
  }

  async chart(filter: FilterDto) {
    const { entities: data } = await this.findAll(filter);

    const groupedData = data.reduce((acc, data) => {
      const month = new Date(data.date).getMonth();
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push({
        total: data.total_kehadiran_murid,
        date: data.date,
      });
      return acc;
    }, {});

    const getStatus = (averageTotal: number) => {
      switch (true) {
        case averageTotal >= 1:
          return PemuridanStatusEnum.GOOD;

        case averageTotal >= 0.4:
          return PemuridanStatusEnum.ENOUGH;

        default:
          return PemuridanStatusEnum.BAD;
      }
    };

    const averagePerMonth = Object.keys(groupedData).map((month) => {
      const values = groupedData[month];

      const weekInMonth = getWeeksInMonth(new Date(values[0].date).getFullYear(), Number(month));
      const total = values.length;
      const averageTotal = total / weekInMonth;
      const status = getStatus(averageTotal);

      return {
        month,
        total,
        averageTotal,
        status,
      };
    });

    return averagePerMonth;
  }

  async remove(id: number) {
    const pastReportPemuridan = await this.findOne(id);
    if (!pastReportPemuridan) throw new BadRequestException('Pemuridan report is not found!');

    await this.reportPemuridanRepository.softRemove(pastReportPemuridan);

    return { id };
  }
}
