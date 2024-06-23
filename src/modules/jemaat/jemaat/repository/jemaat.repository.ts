import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { JemaatEntity } from '../entities/jemaat.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class JemaatRepository extends Repository<JemaatEntity> {
  constructor(private dataSource: DataSource) {
    super(JemaatEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('jemaat');
    queryBuilder.leftJoin('jemaat.region', 'region');

    filter.search &&
      queryBuilder.andWhere(
        new Brackets((query) => {
          query
            .where('jemaat.name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('jemaat.full_name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('jemaat.email ILIKE :search', { search: `%${filter.search}%` });
        }),
      );

    filter.region_id && queryBuilder.andWhere('region.id = :region_id', { region_id: filter.region_id });

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    queryBuilder.take(filter?.take);
    queryBuilder.skip((filter?.page - 1) * filter?.take);

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
