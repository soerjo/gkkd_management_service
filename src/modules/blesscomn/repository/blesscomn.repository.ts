import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlesscomnEntity } from '../entities/blesscomn.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class BlesscomnRepository extends Repository<BlesscomnEntity> {
  constructor(private dataSource: DataSource) {
    super(BlesscomnEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('blesscomn');
    queryBuilder.leftJoinAndSelect('blesscomn.lead', 'lead');
    queryBuilder.leftJoinAndSelect('blesscomn.region', 'region');

    filter.search &&
      queryBuilder.andWhere('(blesscomn.name ILIKE :search OR blesscomn.lead ILIKE :search)', {
        search: filter.search,
      });

    if (filter.region_id) {
      queryBuilder.andWhere(`region.id = :region_id`, { region_id: filter.region_id });
    }

    if (filter.region_ids && filter.region_ids.length) {
      queryBuilder.andWhere(`region.id IN (:...region_ids)`, { region_ids: filter.region_ids });
    }

    if (filter.take) {
      queryBuilder.take(filter?.take);
      queryBuilder.orderBy(`blesscomn.created_at`, 'DESC');
      queryBuilder.skip((filter?.page - 1) * filter?.take);
    }

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
