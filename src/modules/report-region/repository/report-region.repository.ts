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
    const queryBuilder = this.createQueryBuilder('region');
    queryBuilder.where('region.name != :name', { name: 'superadmin' });

    // filter.search &&
    //   queryBuilder.andWhere(
    //     '(region.name ILIKE :search OR region.lead ILIKE :search)',
    //     { search: filter.search },
    //   );

    if (filter.take) {
      queryBuilder.take(filter?.take);
      queryBuilder.orderBy(`region.created_at`, 'DESC');
      queryBuilder.skip((filter?.page - 1) * filter?.take);
    }

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const meta = {
      page: filter?.page || 0,
      offset: filter?.take || 0,
      itemCount: itemCount || 0,
      pageCount: Math.ceil(itemCount / filter?.take)
        ? Math.ceil(itemCount / filter?.take)
        : 0,
    };

    return { entities, meta };
  }
}