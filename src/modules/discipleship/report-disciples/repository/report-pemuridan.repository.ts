import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportPemuridanEntity } from '../entities/report-pemuridan.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class ReportPemuridanRepository extends Repository<ReportPemuridanEntity> {
  constructor(private dataSource: DataSource) {
    super(ReportPemuridanEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('pemuridan_report');

    queryBuilder.leftJoin('pemuridan_report.pemuridan', 'pemuridan');
    queryBuilder.addSelect(['pemuridan.name', 'pemuridan.id']);

    queryBuilder.leftJoin('pemuridan.lead', 'lead');
    queryBuilder.addSelect(['lead.id', 'lead.full_name', 'lead.name']);

    if (filter.lead_id) {
      queryBuilder.andWhere('lead.id = :lead_id', { lead_id: filter.lead_id });
    }

    if (filter.date_start) {
      queryBuilder.andWhere('pemuridan_report.date >= :date_start', { date_start: filter.date_start });
    }

    if (filter.date_end) {
      queryBuilder.andWhere('pemuridan_report.date <= :date_end', { date_end: filter.date_end });
    }

    if (filter.take) {
      queryBuilder.take(filter?.take);
      queryBuilder.skip((filter?.page - 1) * filter?.take);
    }

    queryBuilder.orderBy(`pemuridan_report.created_at`, 'DESC');

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const meta = {
      page: filter?.page || 0,
      offset: filter?.take || 0,
      itemCount: itemCount || 0,
      pageCount: Math.ceil(itemCount / filter?.take) ? Math.ceil(itemCount / filter?.take) : 0,
    };

    return { entities, meta };
  }
}
