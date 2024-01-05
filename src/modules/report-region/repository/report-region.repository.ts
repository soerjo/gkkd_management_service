import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportRegionEntity } from '../entities/report-region.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class ReportRegionRepository extends Repository<ReportRegionEntity> {
  constructor(private dataSource: DataSource) {
    super(ReportRegionEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('region_report');
    queryBuilder.leftJoinAndSelect('region_report.region', 'region');

    if (filter.region_id) {
      queryBuilder.andWhere('region.id = :region_id', { region_id: filter.region_id });
    }

    if (filter.date_start) {
      queryBuilder.andWhere('region_report.date >= :date_start', { date_start: filter.date_start });
    }

    if (filter.date_end) {
      queryBuilder.andWhere('region_report.date <= :date_end', { date_end: filter.date_end });
    }

    if (filter.take) {
      queryBuilder.take(filter?.take);
      queryBuilder.skip((filter?.page - 1) * filter?.take);
    }

    queryBuilder.orderBy('region_report.date', 'DESC');

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
