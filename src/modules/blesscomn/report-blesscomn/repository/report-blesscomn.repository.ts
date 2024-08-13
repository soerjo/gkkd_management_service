import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { ReportBlesscomnEntity } from '../entities/report-blesscomn.entity';
import { FilterDto } from '../dto/filter.dto';
import { RegionEntity } from '../../../region/entities/region.entity';
import { BlesscomnEntity } from '../../blesscomn/entities/blesscomn.entity';

@Injectable()
export class ReportBlesscomnRepository extends Repository<ReportBlesscomnEntity> {
  constructor(private dataSource: DataSource) {
    super(ReportBlesscomnEntity, dataSource.createEntityManager());
  }

  async getOne(id: number, region_id?: number, blesscomn_ids?: number[]) {
    const queryBuilder = this.createQueryBuilder('blesscomn_report');
    queryBuilder.leftJoinAndSelect('blesscomn_report.blesscomn', 'blesscomn');
    queryBuilder.leftJoinAndSelect(RegionEntity, 'region', 'region.id = blesscomn.region_id');
    queryBuilder.andWhere('blesscomn_report.id = :id', { id });
    if (region_id) queryBuilder.andWhere('region.id = :region_id', { region_id });

    queryBuilder.select([
      'blesscomn_report.id as id',
      'blesscomn_report.date as date',
      'blesscomn_report.total_male as total_male',
      'blesscomn_report.total_female as total_female',
      'blesscomn_report.new_male as new_male',
      'blesscomn_report.new_female as new_female',
      'blesscomn_report.total as total',
      'blesscomn_report.new as new',
      'blesscomn.id as blesscomn_id',
      'blesscomn.name as blesscomn_name',
      'region.id as region_id',
      'region.name as region_name',
    ]);

    const entities = await queryBuilder.getRawOne();
    return entities;
  }

  async getExport(blesscomn_ids?: number[]) {
    const queryBuilder = this.createQueryBuilder('blesscomn_report');
    queryBuilder.leftJoinAndSelect('blesscomn_report.blesscomn', 'blesscomn');
    queryBuilder.leftJoin('blesscomn.admin', 'admin');
    queryBuilder.leftJoinAndSelect(RegionEntity, 'region', 'region.id = blesscomn.region_id');

    if (blesscomn_ids?.length) {
      queryBuilder.andWhere('blesscomn.id in (:...blesscomn_ids)', { blesscomn_ids });
    }

    queryBuilder.select([
      'blesscomn_report.blesscomn_id as blesscomn_id',
      'blesscomn_report.date as date',
      'blesscomn_report.total_male as total_male',
      'blesscomn_report.total_female as total_female',
      'blesscomn_report.new_male as total_new_male',
      'blesscomn_report.new_female as total_new_female',
      'blesscomn_report.total as total',
      'blesscomn_report.new as new',
    ]);

    return queryBuilder.getRawMany();
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('blesscomn_report');
    queryBuilder.leftJoinAndSelect('blesscomn_report.blesscomn', 'blesscomn');
    queryBuilder.leftJoinAndSelect(RegionEntity, 'region', 'region.id = blesscomn.region_id');
    if (!filter.date_from && !filter.date_to) {
      queryBuilder.andWhere("DATE_TRUNC('month', blesscomn_report.date) = DATE_TRUNC('month', CURRENT_DATE)");
    }

    if (filter.admin_id) {
      queryBuilder.leftJoin('blesscomn.admin', 'admin');
      queryBuilder.andWhere('admin.admin_id = :admin_id', { admin_id: filter.admin_id });
    }

    if (filter.blesscomn_id) {
      queryBuilder.andWhere('blesscomn.id = :blesscomn_id', { blesscomn_id: filter.blesscomn_id });
    }

    if (!filter.blesscomn_id && filter.blesscomn_ids?.length)
      queryBuilder.andWhere('blesscomn.id in (:...blesscomn_ids)', { blesscomn_ids: filter.blesscomn_ids });

    if (!filter.admin_id && filter.region_id) {
      queryBuilder.andWhere('region.id = :region_id', { region_id: filter.region_id });
    }

    if (filter.date_to) {
      queryBuilder.andWhere(`blesscomn_report.date <= :date_to`, { date_to: filter.date_to });
    }

    if (filter.date_from) {
      queryBuilder.andWhere(`blesscomn_report.date >= :date_from`, { date_from: filter.date_from });
    }

    queryBuilder.limit(filter?.take);
    queryBuilder.offset((filter?.page - 1) * filter?.take);

    queryBuilder.orderBy('blesscomn_report.date', 'DESC');

    queryBuilder.select([
      'blesscomn_report.id as id',
      'blesscomn_report.date as date',
      'blesscomn_report.total_male as total_male',
      'blesscomn_report.total_female as total_female',
      'blesscomn_report.new_male as total_new_male',
      'blesscomn_report.new_female as total_new_female',
      'blesscomn_report.total as total',
      'blesscomn_report.new as new',
      'blesscomn.id as blesscomn_id',
      'blesscomn.name as blesscomn_name',
      'region.id as region_id',
      'region.name as region_name',
    ]);

    const entities = await queryBuilder.getRawMany();
    const itemCount = await queryBuilder.getCount();

    const meta = {
      page: filter?.page || 0,
      offset: filter?.take || 0,
      itemCount: itemCount || 0,
      pageCount: Math.ceil(itemCount / filter?.take) ? Math.ceil(itemCount / filter?.take) : 0,
    };

    return { entities, meta };
  }

  filterUniqueRecordsByDate(records: ReportBlesscomnEntity[]): ReportBlesscomnEntity[] {
    const seenDate = new Set();
    const seenBlesscomn = new Set();

    return records.filter((record) => {
      const dateValue = record.date.toISOString();
      const blesscomnValue = record.blesscomn.name;
      if (!seenDate.has(dateValue) || !seenBlesscomn.has(blesscomnValue)) {
        seenDate.add(dateValue);
        seenBlesscomn.add(blesscomnValue);
        return true;
      }
      return false;
    });
  }

  async getAverageMonthly(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('blesscomn_report');
    queryBuilder.leftJoin('blesscomn_report.blesscomn', 'blesscomn');

    queryBuilder.andWhere("DATE_TRUNC('month', blesscomn_report.date) = DATE_TRUNC('month', CURRENT_DATE)");

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('blesscomn.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
        qb.orWhere('blesscomn.region_id = :region_id', { region_id: filter.region_id });
      }),
    );

    queryBuilder.select('AVG(blesscomn_report.total)', 'average');
    return queryBuilder.getRawOne();
  }

  async getAverageLastMonth(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('blesscomn_report');
    queryBuilder.leftJoin('blesscomn_report.blesscomn', 'blesscomn');

    queryBuilder.andWhere(
      "DATE_TRUNC('month', blesscomn_report.date) = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'",
    );

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('blesscomn.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
        qb.orWhere('blesscomn.region_id = :region_id', { region_id: filter.region_id });
      }),
    );

    queryBuilder.select('AVG(blesscomn_report.total)', 'average');
    return queryBuilder.getRawOne();
  }

  async getReportByRegion(filter: any): Promise<any[]> {
    const subQuery = this.dataSource.createQueryBuilder(ReportBlesscomnEntity, 'report');
    subQuery.andWhere("DATE_TRUNC('week', report.date) = DATE_TRUNC('week', CURRENT_DATE)");

    const queryBuilder = this.dataSource.createQueryBuilder(RegionEntity, 'region');
    queryBuilder.leftJoinAndSelect(BlesscomnEntity, 'blesscomn', 'blesscomn.region_id = region.id');
    if (filter?.region_ids.length) {
      queryBuilder.andWhere('region.id in ( :...region_ids )', { region_ids: filter.region_ids });
    } else {
      queryBuilder.andWhere('region.id IS NULL');
    }
    queryBuilder.andWhere('blesscomn.id IS NOT NULL');
    queryBuilder.leftJoinAndSelect(
      `(${subQuery.getQuery()})`,
      'subreport',
      'subreport.report_blesscomn_id = blesscomn.unique_id',
    );
    queryBuilder.andWhere('subreport.report_id is null');

    return queryBuilder.getRawMany();
  }
}
