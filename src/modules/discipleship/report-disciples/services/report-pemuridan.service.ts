import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportPemuridanDto } from '../dto/create-report-pemuridan.dto';
import { UpdateReportPemuridanDto } from '../dto/update-report-pemuridan.dto';
import { ReportPemuridanRepository } from '../repository/report-pemuridan.repository';
import { FilterDto } from '../dto/filter.dto';
import { DataSource, IsNull } from 'typeorm';
import { getWeeksInMonth } from '../../../../utils/week-in-month.utils';
import { PemuridanStatusEnum } from '../../../../common/constant/pemuridan-status.constant';
import { DisciplesService } from '../../disciples/services/disciples.service';
import { RegionService } from '../../../region/services/region.service';
import { DisciplesGroupService } from '../../disciples-group/services/disciples.service';
import { ReportPemuridanEntity } from '../entities/report-pemuridan.entity';

@Injectable()
export class ReportPemuridanService {
  constructor(
    private readonly groupPemuridanService: DisciplesGroupService,
    private readonly reportPemuridanRepository: ReportPemuridanRepository,
    private readonly regionService: RegionService,
    private readonly pemuridanService: DisciplesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateReportPemuridanDto) {
    const group = await this.groupPemuridanService.findOne(dto.disciple_group_id);
    if (!group) throw new BadRequestException('group is not found');

    const isDataExist = await this.reportPemuridanRepository.findOne({
      where: {
        date: new Date(dto.date),
        disciple_group_unique_id: group.unique_id,
      },
    });
    if (isDataExist) throw new BadRequestException('data already exist!');

    const reportPemuridan = this.reportPemuridanRepository.create({
      ...dto,
      date: new Date(dto.date),
      disciple_group_unique_id: group.unique_id,
      pembimbing_nim: group.pembimbing_nim,
    });

    return this.reportPemuridanRepository.save(reportPemuridan);
  }

  async findAll(filter: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_tree_id });
    filter.region_ids = regions.map((data) => data.id);
    filter.region_tree_id && filter.region_ids.push(filter.region_tree_id);

    const disciples = await this.pemuridanService.getByHierarchy({ pembimbing_id: filter.pembimbing_id });
    filter.disciple_nims = disciples.map((data) => data.nim);
    filter.disciple_nims.push(filter.pembimbing_nim);

    return this.reportPemuridanRepository.getAll(filter);
  }

  findOne(id: number) {
    return this.reportPemuridanRepository.findOne({
      where: { id: id ?? IsNull() },
      relations: { disciple_group: { pembimbing: true } },
    });
  }

  async update(id: number, dto: UpdateReportPemuridanDto) {
    const pastReport = await this.findOne(id);
    if (!pastReport) throw new BadRequestException('Pemuridan report is not found!');

    const group = await this.groupPemuridanService.findOne(dto.disciple_group_id);
    if (!group) throw new BadRequestException('group is not found');

    const isDataExist = await this.reportPemuridanRepository.findOne({
      where: {
        date: dto.date,
        disciple_group_unique_id: group.unique_id,
      },
    });
    if (isDataExist && isDataExist.id !== pastReport.id) {
      throw new BadRequestException('data already exist!');
    }

    const reportPemuridan = this.reportPemuridanRepository.create({
      ...pastReport,
      ...dto,
      date: new Date(dto.date),
      disciple_group: group,
      disciple_group_unique_id: group.unique_id,
      pembimbing_nim: group.pembimbing_nim,
    });

    await this.reportPemuridanRepository.save(reportPemuridan);

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

    await this.reportPemuridanRepository.remove(pastReportPemuridan);

    return { id };
  }

  async upload(listData: Partial<ReportPemuridanEntity>[], disciple_group_ids?: string[]) {
    const batchSize = 1000; // Define the batch size
    const totalBatches = Math.ceil(listData.length / batchSize);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      let batch = listData.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

      for (const bc of batch) {
        if (!disciple_group_ids.includes(bc.disciple_group_unique_id))
          throw new BadRequestException('not valid blesscomn_id in file');
      }

      try {
        await this.dataSource.transaction(async (manager) => {
          await manager
            .createQueryBuilder()
            .insert()
            .into(ReportPemuridanEntity)
            .values(batch)
            .orUpdate(['material', 'pembimbing_nim'], ['date', 'disciple_group_unique_id'])
            .execute();
        });
      } catch (error) {
        console.log({ error });
        throw new BadRequestException('data can not be uploaded');
      }
    }
  }

  async export(disciple_group_ids?: string[], region_id?: number) {
    const queryBuilder = this.reportPemuridanRepository.createQueryBuilder('report');
    queryBuilder.leftJoinAndSelect('report.disciple_group', 'disciple_group');

    if (disciple_group_ids.length) {
      queryBuilder.andWhere('report.disciple_group_unique_id in (:...disciple_group_ids)', { disciple_group_ids });
    }

    if (region_id) {
      queryBuilder.andWhere('report.region_id = :region_id', { region_id });
    }

    queryBuilder.select([
      'report.disciple_group_unique_id as disciple_group_unique_id',
      'report.date as date',
      'report.material as material',
    ]);

    return queryBuilder.getRawMany();
  }

  async getDashboardData(dto: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: dto?.region_id });
    dto.region_ids = regions.map((data) => data.id);

    const averageThisMonth = await this.reportPemuridanRepository.getAverageMonthly(dto);
    const averageLastMonth = await this.reportPemuridanRepository.getAverageLastMonth(dto);

    const devider = Number(averageLastMonth?.count) ? Number(averageLastMonth?.count) : 1;

    let percentage = ((Number(averageThisMonth?.count) - Number(averageLastMonth?.count)) / devider) * 100;
    return {
      total: Number(averageThisMonth?.count),
      percentage: Math.round(percentage * 100) / 100,
    };
  }
}
