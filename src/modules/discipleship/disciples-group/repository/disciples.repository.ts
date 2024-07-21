import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';
import { DisciplesGroupEntity } from '../entities/disciples-group.entity';
import { DisciplesEntity } from '../../disciples/entities/disciples.entity';

@Injectable()
export class DisciplesGroupRepository extends Repository<DisciplesGroupEntity> {
  constructor(private dataSource: DataSource) {
    super(DisciplesGroupEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('group');
    queryBuilder.leftJoinAndSelect(DisciplesEntity, 'pembimbing', 'pembimbing.nim = group.pembimbing_nim');

    filter.search &&
      queryBuilder.andWhere('(group.name ILIKE :search OR pembimbing.name ILIKE :search)', {
        search: `%${filter.search}%`,
      });

    if (filter.pembimbing_nim) {
      queryBuilder.andWhere('group.pembimbing_nim = :pembimbing_nim', { pembimbing_nim: filter.pembimbing_nim });
    }

    if (filter.region_id) {
      queryBuilder.andWhere('group.region_id = :region_id', { region_id: filter.region_id });
    }

    if (filter.take) {
      queryBuilder.limit(filter?.take);
      queryBuilder.offset((filter?.page - 1) * filter?.take);
      queryBuilder.orderBy(`group.created_at`, 'DESC');
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
