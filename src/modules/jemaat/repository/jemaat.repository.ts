import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JemaatEntity } from '../entities/jemaat.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class JemaatRepository extends Repository<JemaatEntity> {
  constructor(private dataSource: DataSource) {
    super(JemaatEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('jemaat');

    filter.search &&
      queryBuilder.andWhere(
        '(jemaat.name ILIKE :search OR jemaat.email ILIKE :search OR jemaat.full_name ILIKE :search)',
        { search: filter.search },
      );

    if (filter.take) {
      queryBuilder.take(filter?.take);
      queryBuilder.skip((filter?.page - 1) * filter?.take);
    }

    queryBuilder.orderBy(`jemaat.created_at`, 'DESC');

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
