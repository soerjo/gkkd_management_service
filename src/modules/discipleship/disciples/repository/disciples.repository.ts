import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';
import { DisciplesEntity } from '../entities/disciples.entity';

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
        pembimbing_nim,
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

    if (filter.pembimbing_nim) {
      query += ` and pembimbing_nim  = $${params.length + 1} `;
      params.push(filter.pembimbing_nim);
    } else {
      query += ` and pembimbing_nim is null `;
    }

    query += `
      union all
      select
        e.id,
        e.nim,
        e.name,
        e.pembimbing_nim,
        case
          when e.deleted_at is null then true
          else false
        end as status,
        eh.level + 1
      from
        disciples e
      inner join disciples_hierarchy eh on
        e.pembimbing_nim = eh.nim
            )
            select
        rh.id,
        rh.nim,
        rh.name,
        rh.pembimbing_nim,
        rh.status,
        e.name as parent,
        level
      from
        disciples_hierarchy rh
      left join disciples e on
        rh.pembimbing_nim = e.nim
    `;

    return await this.query(query, params);
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('disciples');
    queryBuilder.leftJoinAndSelect('disciples.group', 'my_group');
    queryBuilder.leftJoinAndSelect('disciples.disciple_group', 'group');
    queryBuilder.leftJoinAndSelect(DisciplesEntity, 'pembimbing', 'pembimbing.nim = disciples.pembimbing_nim');

    filter.search &&
      queryBuilder.andWhere('(disciples.name ILIKE :search OR pembimbing.name ILIKE :search)', {
        search: `%${filter.search}%`,
      });

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('disciples.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
      }),
    );

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.disciple_nims.length) {
          qb.where('disciples.nim in ( :...disciple_nims )', { disciple_nims: filter.disciple_nims });
        }
      }),
    );

    if (filter.pembimbing_nim) {
      queryBuilder.andWhere('disciples.pembimbing_nim = :pembimbing_nim', { pembimbing_nim: filter.pembimbing_nim });
    }

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
