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
    queryBuilder.where('blesscomn.name != :name', { name: 'superadmin' });

    filter.search &&
      queryBuilder.andWhere(
        '(blesscomn.name ILIKE :search OR blesscomn.lead ILIKE :search)',
        { search: filter.search },
      );

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
      pageCount: Math.ceil(itemCount / filter?.take)
        ? Math.ceil(itemCount / filter?.take)
        : 0,
    };

    return { entities, meta };
  }
}
