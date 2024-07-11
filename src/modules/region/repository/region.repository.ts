import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RegionEntity } from '../entities/region.entity';
import { FilterDto } from '../dto/filter.dto';
import { IRegion } from '../interface/region.interface';

@Injectable()
export class RegionRepository extends Repository<RegionEntity> {
  constructor(private dataSource: DataSource) {
    super(RegionEntity, dataSource.createEntityManager());
  }

  async getByHirarcy(filter: FilterDto): Promise<IRegion[]> {
    const params: any[] = [];
    let query = `
      WITH RECURSIVE region_hierarchy AS (
        SELECT 
            id,
            name,
            parent_id,
            alt_name,
            location,
            CASE 
              WHEN deleted_at IS NULL THEN TRUE 
              ELSE FALSE 
            END AS status,
            1 AS level
        FROM region
        WHERE region.id is not null 
    `;

    if (filter.region_id) {
      query += ` and parent_id  = $${params.length + 1} `;
      params.push(filter.region_id);
    } else {
      query += ` and parent_id is null `;
    }

    query += `
        UNION ALL
        SELECT 
            e.id,
            e.name,
            e.parent_id,
            e.alt_name,
            e.location,
            CASE 
              WHEN e.deleted_at IS NULL THEN TRUE 
              ELSE FALSE 
            END AS status,
            eh.level + 1
        FROM region e
        INNER JOIN region_hierarchy eh ON e.parent_id = eh.id
      )
      SELECT 
          rh.id,
          rh.name,
          rh.parent_id,
          rh.alt_name,
          rh.location,
          rh.status,
           e.name as parent,
          level
      FROM region_hierarchy rh
      left join region e on rh.parent_id = e.id
    `;

    if (filter.search) {
      query += ` where rh.name ILIKE $${params.length + 1} `;
      params.push(`%${filter.search}%`);
    }

    if (filter.take) {
      params.push(filter.take);
      params.push((filter?.page - 1) * filter?.take);
      query += ` LIMIT $${params.length - 1} OFFSET $${params.length};`;
    }

    return await this.query(query, params);
  }

  async getCountByHirarcy(filter: FilterDto): Promise<number> {
    const params: any[] = [];
    let query = `
      WITH RECURSIVE region_hierarchy AS (
        SELECT 
            id,
            name,
            parent_id,
            alt_name,
            location,
            CASE 
              WHEN deleted_at IS NULL THEN TRUE 
              ELSE FALSE 
            END AS status,
            1 AS level
        FROM region
        WHERE region.id is not null 
    `;

    if (filter.region_id) {
      query += ` and parent_id  = $${params.length + 1} `;
      params.push(filter.region_id);
    } else {
      query += ` and parent_id is null `;
    }

    query += `
        UNION ALL
        SELECT 
            e.id,
            e.name,
            e.parent_id,
            e.alt_name,
            e.location,
            CASE 
              WHEN e.deleted_at IS NULL THEN TRUE 
              ELSE FALSE 
            END AS status,
            eh.level + 1
        FROM region e
        INNER JOIN region_hierarchy eh ON e.parent_id = eh.id
      )
      SELECT count(*)
      FROM region_hierarchy rh
      left join region e on rh.parent_id = e.id
    `;
    if (filter.search) {
      query += ` where rh.name ILIKE $${params.length + 1} `;
      params.push(`%${filter.search}%`);
    }

    return (await this.query(query, params))[0].count;
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('region');
    queryBuilder.leftJoinAndSelect('region.parent', 'parent');
    queryBuilder.withDeleted();

    filter.search &&
      queryBuilder.andWhere('(region.name ILIKE :search OR region.alt_name ILIKE :search)', {
        search: `%${filter.search}%`,
      });

    queryBuilder.take(filter?.take);
    queryBuilder.orderBy(`region.created_at`, 'DESC');
    queryBuilder.skip((filter?.page - 1) * filter?.take);

    queryBuilder.select([
      'region.id as id',
      'region.name as name',
      'region.alt_name as alt_name',
      'region.location as location',
      'region.parent_id as parent_id',
      'parent.name as parent',
      `
      CASE 
        WHEN region.deleted_at IS NULL THEN TRUE 
        ELSE FALSE 
      END AS status
      `,
    ]);

    const entities: IRegion[] = await queryBuilder.getRawMany();
    const itemCount = await queryBuilder.getCount();

    const meta = {
      page: filter?.page || 0,
      offset: filter?.take || 0,
      itemCount: itemCount || 0,
      pageCount: Math.ceil(itemCount / filter?.take) ? Math.ceil(itemCount / filter?.take) : 0,
    };

    return { entities, meta };
  }

  async getOneById(id: number) {
    const queryBuilder = this.createQueryBuilder('region');
    queryBuilder.leftJoinAndSelect('region.parent', 'parent');
    queryBuilder.withDeleted();

    queryBuilder.select([
      'region.id as id',
      'region.name as name',
      'region.alt_name as alt_name',
      'region.location as location',
      'region.parent_id as parent_id',
      'parent.name as parent',
      `
      CASE 
        WHEN region.deleted_at IS NULL THEN TRUE 
        ELSE FALSE 
      END AS status
      `,
    ]);

    const entities: IRegion = await queryBuilder.getRawOne();
    return entities;
  }
}
