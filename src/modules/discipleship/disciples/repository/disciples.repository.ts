import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';
import { DisciplesEntity } from '../entities/disciples.entity';

@Injectable()
export class DisciplesRepository extends Repository<DisciplesEntity> {
  constructor(private dataSource: DataSource) {
    super(DisciplesEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('disciples');

    filter.search &&
      queryBuilder.andWhere('(disciples.name ILIKE :search OR disciples.lead ILIKE :search)', {
        search: filter.search,
      });

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('disciples.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
      }),
    );

    if (filter.region_id) {
      queryBuilder.andWhere('disciples.region_id = :region_id', { region_id: filter.region_id });
    }

    if (filter.take) {
      queryBuilder.limit(filter?.take);
      queryBuilder.offset((filter?.page - 1) * filter?.take);
      queryBuilder.orderBy(`disciples.created_at`, 'DESC');
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
