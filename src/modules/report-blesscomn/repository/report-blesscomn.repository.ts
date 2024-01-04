import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportBlesscomnEntity } from '../entities/report-blesscomn.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class ReportBlesscomnRepository extends Repository<ReportBlesscomnEntity> {
  constructor(private dataSource: DataSource) {
    super(ReportBlesscomnEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('blesscomn_report');
    queryBuilder.leftJoinAndSelect('blesscomn_report.blesscomn', 'blesscomn');

    if (!filter.region_id && !filter.region_ids) {
      queryBuilder.leftJoinAndSelect('blesscomn.region', 'region');
    }

    if (filter.blesscomn_id) {
      queryBuilder.andWhere('blesscomn.id = :blesscomn_id', { blesscomn_id: filter.blesscomn_id });
    }

    if (filter.date_start) {
      queryBuilder.andWhere('blesscomn_report.date >= :date_start', { date_start: filter.date_start });
    }

    if (filter.date_end) {
      queryBuilder.andWhere('blesscomn_report.date <= :date_end', { date_end: filter.date_end });
    }

    if (filter.take) {
      queryBuilder.take(filter?.take);
      queryBuilder.skip((filter?.page - 1) * filter?.take);
    }

    queryBuilder.orderBy('blesscomn_report.created_at', 'DESC');

    const entities = await queryBuilder.getMany();
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
