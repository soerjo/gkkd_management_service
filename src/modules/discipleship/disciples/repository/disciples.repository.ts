import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';
import { DisciplesEntity } from '../entities/disciples.entity';
import { RegionEntity } from '../../../region/entities/region.entity';
import { JemaatEntity } from '../../../jemaat/jemaat/entities/jemaat.entity';

@Injectable()
export class DisciplesRepository extends Repository<DisciplesEntity> {
  constructor(private dataSource: DataSource) {
    super(DisciplesEntity, dataSource.createEntityManager());
  }

  async getByHirarcy(filter: FilterDto): Promise<DisciplesEntity[]> {
    const params: any[] = [];
    let query = `
      with recursive disciples_hierarchy as (
      select
        id,
        nim,
        name,
        pembimbing_id,
        case
          when deleted_at is null then true
          else false
        end as status,
        1 as level
      from
        disciples
      where
        disciples.id is not null 
    `;

    if (filter.pembimbing_id) {
      query += ` and pembimbing_id  = $${params.length + 1} `;
      params.push(filter.pembimbing_id);
    } else {
      query += ` and pembimbing_id is null `;
    }

    query += `
      union all
      select
        e.id,
        e.nim,
        e.name,
        e.pembimbing_id,
        case
          when e.deleted_at is null then true
          else false
        end as status,
        eh.level + 1
      from
        disciples e
      inner join disciples_hierarchy eh on
        e.pembimbing_id = eh.id
            )
            select
        rh.id,
        rh.name,
        rh.nim,
        rh.pembimbing_id,
        rh.status,
        e.name as parent,
        level
      from
        disciples_hierarchy rh
      left join disciples e on
        rh.pembimbing_id = e.id
    `;

    return await this.query(query, params);
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('disciples');
    queryBuilder.leftJoinAndSelect('disciples.parent', 'parent');
    queryBuilder.leftJoinAndSelect('disciples.childs', 'childs');
    queryBuilder.leftJoinAndSelect('disciples.region', 'region');
    queryBuilder.leftJoinAndSelect('disciples.group', 'group');

    filter.search &&
      queryBuilder.andWhere('(disciples.name ILIKE :search OR disciples.name ILIKE :search)', {
        search: `%${filter.search}%`,
      });

    if (filter.region_ids.length) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('disciples.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }),
      );
    }

    if (filter.disciple_ids.length) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('disciples.id in ( :...disciple_ids )', { disciple_ids: filter.disciple_ids });
          if (filter.pembimbing_id) {
            qb.andWhere('disciples.pembimbing_id = :pembimbing_id', { pembimbing_id: filter.pembimbing_id });
          }
        }),
      );
    }

    if (!filter.disciple_ids.length) {
      queryBuilder.andWhere('disciples.pembimbing_id = :pembimbing_id', { pembimbing_id: filter.pembimbing_id });
    }

    if (filter.region_id) {
      queryBuilder.andWhere('disciples.region_id = :region_id', { region_id: filter.region_id });
    }

    if (filter.group_unique_id) {
      queryBuilder.andWhere('disciples.group = :group_unique_id', { group_unique_id: filter.group_unique_id });
    }

    queryBuilder.limit(filter?.take);
    queryBuilder.offset((filter?.page - 1) * filter?.take);
    queryBuilder.orderBy(`disciples.created_at`, 'DESC');

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

  async getOne(nim: string) {
    const queryBuilder = this.createQueryBuilder('disciples');
    queryBuilder.leftJoinAndSelect('disciples.parent', 'parent');
    queryBuilder.leftJoinAndSelect('disciples.childs', 'childs');
    queryBuilder.leftJoinAndSelect('disciples.region', 'region');
    queryBuilder.leftJoinAndSelect('disciples.group', 'group');
    queryBuilder.leftJoinAndSelect(JemaatEntity, 'jemaat', 'jemaat.nij = disciples.jemaat_nij');

    queryBuilder.andWhere('disciples.nim = :nim', { nim });

    return queryBuilder.getOne();
  }
}
