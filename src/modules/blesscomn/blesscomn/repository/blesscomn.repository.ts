import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { BlesscomnEntity } from '../entities/blesscomn.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class BlesscomnRepository extends Repository<BlesscomnEntity> {
  constructor(private dataSource: DataSource) {
    super(BlesscomnEntity, dataSource.createEntityManager());
  }

  async getBlesscomnByAdminId(adminId: number) {
    const queryBuilder = this.createQueryBuilder('blesscomn');
    queryBuilder.leftJoinAndSelect('blesscomn.lead', 'lead');
    queryBuilder.leftJoinAndSelect('blesscomn.region', 'region');
    queryBuilder.leftJoinAndSelect('blesscomn.admin', 'admin');

    queryBuilder.andWhere('admin.admin_id = :adminId', { adminId });

    return queryBuilder.getMany();
  }

  async getOne(id: number, region_id?: number) {
    const queryBuilder = this.createQueryBuilder('blesscomn');
    queryBuilder.leftJoinAndSelect('blesscomn.lead', 'lead');
    queryBuilder.leftJoinAndSelect('blesscomn.region', 'region');
    queryBuilder.leftJoinAndSelect('blesscomn.admin', 'admin');
    queryBuilder.andWhere('blesscomn.id = :id', { id });
    if (region_id) queryBuilder.andWhere('blesscomn.region_id = :region_id', { region_id });

    queryBuilder.select([
      'blesscomn.id as id',
      'blesscomn.unique_id as unique_id',
      'blesscomn.name as name',
      'blesscomn.location as location',
      'blesscomn.time as time',
      'blesscomn.day as day',
      'blesscomn.segment as segment',
      'lead.id as lead_id',
      'lead.name as lead_name',
      'region.id as region_id',
      'region.name as region_name',
      'blesscomn.members as members',
      'admin.admin_id as admin_id',
    ]);

    const entities = await queryBuilder.getRawOne();
    return entities;
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('blesscomn');
    // queryBuilder.leftJoinAndSelect('blesscomn.lead', 'lead');
    queryBuilder.leftJoinAndSelect('blesscomn.region', 'region');

    queryBuilder.select([
      'blesscomn.id as id',
      'blesscomn.unique_id as unique_id',
      'blesscomn.name as name',
      'blesscomn.location as location',
      'blesscomn.time as time',
      'blesscomn.day as day',
      'blesscomn.segment as segment',
      // 'lead.id as lead_id',
      // 'lead.name as lead_name',
      'region.id as region_id',
      'region.name as region_name',
    ]);

    filter.search &&
      queryBuilder.andWhere('(blesscomn.name ILIKE :search OR blesscomn.unique_id ILIKE :search)', {
        search: `%${filter.search}%`,
      });

    if (filter.admin_id) {
      queryBuilder.leftJoin('blesscomn.admin', 'admin');
      queryBuilder.andWhere(`admin.admin_id = :admin_id`, { admin_id: filter.admin_id });
      queryBuilder.addSelect(['admin.admin_id as admin_id']);
    }

    if (!filter.admin_id && filter.region_id) {
      queryBuilder.andWhere(`region.id = :region_id`, { region_id: filter.region_id });
    }

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('blesscomn.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
      }),
    );

    filter?.take && queryBuilder.limit(filter?.take);
    filter?.page && queryBuilder.offset((filter?.page - 1) * filter?.take);

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
}
