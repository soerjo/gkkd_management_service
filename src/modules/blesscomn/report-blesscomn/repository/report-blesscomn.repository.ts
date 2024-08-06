import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportBlesscomnEntity } from '../entities/report-blesscomn.entity';
import { FilterDto } from '../dto/filter.dto';
import { RegionEntity } from '../../../region/entities/region.entity';

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

  async getAll(filter: FilterDto) {
    console.log({ filter });
    const queryBuilder = this.createQueryBuilder('blesscomn_report');
    queryBuilder.leftJoinAndSelect('blesscomn_report.blesscomn', 'blesscomn');
    queryBuilder.leftJoin('blesscomn.admin', 'admin');
    queryBuilder.leftJoinAndSelect(RegionEntity, 'region', 'region.id = blesscomn.region_id');

    if (filter.admin_id) {
      queryBuilder.andWhere('admin.admin_id = :admin_id', { admin_id: filter.admin_id });
    }

    if (filter.blesscomn_id) {
      queryBuilder.andWhere('blesscomn.id = :blesscomn_id', { blesscomn_id: filter.blesscomn_id });
    }

    if (!filter.blesscomn_id && filter.blesscomn_ids?.length)
      queryBuilder.andWhere('region.id in (:...blesscomn_ids)', { blesscomn_ids: filter.blesscomn_ids });

    if (!filter.admin_id && filter.region_id) {
      queryBuilder.andWhere('region.id = :region_id', { region_id: filter.region_id });
    }

    if (filter.date_to) {
      queryBuilder.andWhere(`blesscomn_report.date <= :date_to`, { date_to: filter.date_to });
    }

    if (filter.date_from) {
      queryBuilder.andWhere(`blesscomn_report.date >= :date_from`, { date_from: filter.date_from });
    }

    if (filter.take) {
      queryBuilder.limit(filter?.take);
      queryBuilder.offset((filter?.page - 1) * filter?.take);
    }

    queryBuilder.orderBy('blesscomn_report.created_at', 'DESC');

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

    console.log(queryBuilder.getQuery());
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
}
