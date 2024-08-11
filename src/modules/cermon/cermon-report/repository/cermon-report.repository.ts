import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FilterReportDto } from '../dto/filter.dto';
import { CermonReportEntity } from '../entities/cermon-report.entity';
import { RegionEntity } from '../../../region/entities/region.entity';
import { CermonScheduleEntity } from '../../cermon-schedule/entities/cermon-schedule.entity';
import { IReportWeekly } from '../interface/report-weekly.interface';

@Injectable()
export class CermonReportRepository extends Repository<CermonReportEntity> {
  constructor(private dataSource: DataSource) {
    super(CermonReportEntity, dataSource.createEntityManager());
  }

  async getOne(id: number, region_id?: number) {
    const queryBuilder = this.createQueryBuilder('cermon-report');
    queryBuilder.leftJoin('cermon-report.cermon', 'cermon');
    queryBuilder.andWhere('cermon-report.id = :id', { id });
    if (region_id) {
      queryBuilder.andWhere('cermon-report.region_id = :region_id', { region_id });
    }

    queryBuilder.select([
      'cermon-report.id as id',
      'cermon-report.date as date',
      'cermon-report.total_male as total_male',
      'cermon-report.total_female as total_female',
      'cermon-report.total_new_male as total_new_male',
      'cermon-report.total_new_female as total_new_female',
      'cermon.id as cermon_id',
      'cermon.name as cermon_name',
    ]);

    return queryBuilder.getRawOne();
  }

  async getAll(filter: FilterReportDto) {
    const queryBuilder = this.createQueryBuilder('cermon-report');
    queryBuilder.leftJoin('cermon-report.cermon', 'cermon');
    if (!filter.date_from && !filter.date_to) {
      queryBuilder.andWhere("DATE_TRUNC('month', cermon-report.date) = DATE_TRUNC('month', CURRENT_DATE)");
    }

    filter.search &&
      queryBuilder.andWhere(
        new Brackets((query) => {
          query
            .where('cermon-report.name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('cermon-report.segment ILIKE :search', { search: `%${filter.search}%` });
        }),
      );

    if (filter.cermon_unique_id) {
      queryBuilder.andWhere('cermon.unique_id = :cermon_unique_id', { cermon_unique_id: filter.cermon_unique_id });
    }

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('cermon.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
        qb.orWhere('cermon.region_id = :region_id', { region_id: filter.region_id });
      }),
    );

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    if (filter.date_to) {
      queryBuilder.andWhere(`cermon-report.date <= :date_to`, { date_to: filter.date_to });
    }

    if (filter.date_from) {
      queryBuilder.andWhere(`cermon-report.date >= :date_from`, { date_from: filter.date_from });
    }

    queryBuilder.limit(filter?.take);
    queryBuilder.offset((filter?.page - 1) * filter?.take);

    queryBuilder.addOrderBy(`cermon-report.date`, 'DESC');

    const itemCount = await queryBuilder.getCount();

    queryBuilder.select([
      'cermon-report.id as id',
      'cermon-report.date as date',
      'cermon-report.total_male as total_male',
      'cermon-report.total_female as total_female',
      'cermon-report.total_new_male as total_new_male',
      'cermon-report.total_new_female as total_new_female',
      'cermon-report.total_male + cermon-report.total_female as total',
      'cermon-report.total_new_male + cermon-report.total_new_female as new',
      'cermon.id as cermon_id',
      'cermon.name as cermon_name',
    ]);

    const entities = await queryBuilder.getRawMany();

    const meta = {
      page: filter?.page || 0,
      offset: filter?.take || 0,
      itemCount: itemCount || 0,
      pageCount: Math.ceil(itemCount / filter?.take) ? Math.ceil(itemCount / filter?.take) : 0,
    };

    return { entities, meta };
  }

  async getExport(cermon_ids?: number[]) {
    const queryBuilder = this.createQueryBuilder('cermon_report');
    queryBuilder.leftJoinAndSelect('cermon_report.cermon', 'cermon');
    queryBuilder.leftJoinAndSelect(RegionEntity, 'region', 'region.id = cermon_report.region_id');
    queryBuilder.andWhere("DATE_TRUNC('month', cermon_report.date) = DATE_TRUNC('month', CURRENT_DATE)");

    if (cermon_ids?.length) {
      queryBuilder.andWhere('cermon.id in (:...cermon_ids)', { cermon_ids });
    }

    queryBuilder.select([
      'cermon_report.cermon_id as cermon_id',
      'cermon_report.date as date',
      'cermon_report.total_male as total_male',
      'cermon_report.total_female as total_female',
      'cermon_report.total_new_male as total_new_male',
      'cermon_report.total_new_female as total_new_female',
      'cermon_report.total_male + cermon_report.total_female as total',
      'cermon_report.total_new_male + cermon_report.total_new_female as new',
    ]);

    return queryBuilder.getRawMany();
  }

  async getAverageMonthly(filter: FilterReportDto) {
    const queryBuilder = this.createQueryBuilder('cermon_report');
    queryBuilder.leftJoinAndSelect('cermon_report.cermon', 'cermon');
    queryBuilder.andWhere("DATE_TRUNC('month', cermon_report.date) = DATE_TRUNC('month', CURRENT_DATE)");

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('cermon.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
        qb.orWhere('cermon.region_id = :region_id', { region_id: filter.region_id });
      }),
    );

    queryBuilder.select('AVG(cermon_report.total_male + cermon_report.total_female)', 'average');
    return queryBuilder.getRawOne();
  }

  async getAverageLastMonth(filter: FilterReportDto) {
    const queryBuilder = this.createQueryBuilder('cermon_report');
    queryBuilder.leftJoinAndSelect('cermon_report.cermon', 'cermon');
    queryBuilder.andWhere(
      "DATE_TRUNC('month', cermon_report.date) = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'",
    );

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('cermon.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
        qb.orWhere('cermon.region_id = :region_id', { region_id: filter.region_id });
      }),
    );

    queryBuilder.select('AVG(cermon_report.total_male + cermon_report.total_female)', 'average');
    return queryBuilder.getRawOne();
  }

  async getReportByRegion(filter: any): Promise<IReportWeekly[]> {
    const subQuery = this.dataSource.createQueryBuilder(CermonReportEntity, 'report');
    subQuery.andWhere("DATE_TRUNC('week', report.date) = DATE_TRUNC('week', CURRENT_DATE)");

    const queryBuilder = this.dataSource.createQueryBuilder(RegionEntity, 'region');
    queryBuilder.leftJoinAndSelect(CermonScheduleEntity, 'cermon', 'cermon.region_id = region.id');
    queryBuilder.andWhere('cermon.id IS NOT NULL');
    queryBuilder.leftJoinAndSelect(
      `(${subQuery.getQuery()})`,
      'subreport',
      'subreport.report_cermon_id = cermon.unique_id',
    );
    queryBuilder.andWhere('subreport.report_id is null');

    return queryBuilder.getRawMany();
  }
}
