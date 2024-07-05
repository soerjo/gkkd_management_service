import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FilterReportDto } from '../dto/filter.dto';
import { CermonReportEntity } from '../entities/cermon-report.entity';

@Injectable()
export class CermonReportRepository extends Repository<CermonReportEntity> {
  constructor(private dataSource: DataSource) {
    super(CermonReportEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterReportDto) {
    const queryBuilder = this.createQueryBuilder('cermon-report');
    queryBuilder.leftJoin('cermon-report.cermon', 'cermon');

    filter.search &&
      queryBuilder.andWhere(
        new Brackets((query) => {
          query
            .where('cermon-report.name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('cermon-report.segment ILIKE :search', { search: `%${filter.search}%` });
        }),
      );

    filter.segment && queryBuilder.andWhere('cermon-report.segment = :segment', { segment: filter.segment });

    filter.region_id && queryBuilder.andWhere('cermon-report.region_id = :region_id', { region_id: filter.region_id });

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    queryBuilder.take(filter?.take);
    queryBuilder.skip((filter?.page - 1) * filter?.take);

    queryBuilder.orderBy(`cermon-report.created_at`, 'DESC');

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
