import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RegionEntity } from '../entities/region.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class RegionRepository extends Repository<RegionEntity> {
  constructor(private dataSource: DataSource) {
    super(RegionEntity, dataSource.createEntityManager());
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

    const entities = await queryBuilder.getRawMany();
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

    const entities = await queryBuilder.getRawOne();
    return entities;
  }
}
