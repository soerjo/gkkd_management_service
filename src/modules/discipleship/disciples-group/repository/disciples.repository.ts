import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';
import { DisciplesGroupEntity } from '../entities/disciples-group.entity';

@Injectable()
export class DisciplesGroupRepository extends Repository<DisciplesGroupEntity> {
  constructor(private dataSource: DataSource) {
    super(DisciplesGroupEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('pemuridan');
    queryBuilder.leftJoin('pemuridan.lead', 'lead');
    queryBuilder.addSelect(['lead.full_name', 'lead.name', 'lead.id']);

    if (filter.lead_id) {
      queryBuilder.andWhere('lead.id = :lead_id', { lead_id: filter.lead_id });
    }

    filter.search &&
      queryBuilder.andWhere('(pemuridan.name ILIKE :search OR pemuridan.lead ILIKE :search)', {
        search: filter.search,
      });

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
      pageCount: Math.ceil(itemCount / filter?.take) ? Math.ceil(itemCount / filter?.take) : 0,
    };

    return { entities, meta };
  }
}
