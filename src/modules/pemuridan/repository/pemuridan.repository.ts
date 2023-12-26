import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PemuridanEntity } from '../entities/pemuridan.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class PemuridanRepository extends Repository<PemuridanEntity> {
  constructor(private dataSource: DataSource) {
    super(PemuridanEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('pemuridan');
    queryBuilder.where('pemuridan.name != :name', { name: 'superadmin' });

    filter.search &&
      queryBuilder.andWhere(
        '(pemuridan.name ILIKE :search OR pemuridan.lead ILIKE :search)',
        { search: filter.search },
      );

    if (filter.take) {
      queryBuilder.take(filter?.take);
      queryBuilder.orderBy(`pemuridan.created_at`, 'DESC');
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
