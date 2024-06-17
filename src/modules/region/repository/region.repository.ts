import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RegionEntity } from '../entities/region.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class RegionRepository extends Repository<RegionEntity> {
  constructor(private dataSource: DataSource) {
    super(RegionEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('region');

    filter.search &&
      queryBuilder.andWhere('(region.name ILIKE :search OR region.alt_name ILIKE :search)', {
        search: `%${filter.search}%`,
      });

    queryBuilder.take(filter?.take);
    queryBuilder.orderBy(`region.created_at`, 'DESC');
    queryBuilder.skip((filter?.page - 1) * filter?.take);

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
}
