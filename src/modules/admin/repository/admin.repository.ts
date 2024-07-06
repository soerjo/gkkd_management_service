import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdminEntity } from '../entities/admin.entity';
import { FilterDto } from '../dto/filter.dto';
import { RoleEnum } from '../../../common/constant/role.constant';

@Injectable()
export class AdminRepository extends Repository<AdminEntity> {
  constructor(private dataSource: DataSource) {
    super(AdminEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.region', 'region');
    queryBuilder.where('user.role != :role', { role: RoleEnum.ROLE_SYSTEMADMIN });
    if (filter.region_ids) {
      queryBuilder.andWhere('user.region_id in (:...region_ids)', { region_ids: filter.region_ids });
    }
    queryBuilder.withDeleted();

    filter.search &&
      queryBuilder.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${filter.search}%` });

    // filter.region_id && queryBuilder.andWhere('region.id = :region_id', { region_id: filter.region_id });

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    queryBuilder.take(filter?.take);
    queryBuilder.orderBy(`user.created_at`, 'DESC');
    queryBuilder.skip((filter?.page - 1) * filter?.take);

    queryBuilder.select([
      'user.id as id',
      'user.name as name',
      'user.email as email',
      'user.phone as phone',
      'user.role as role',
      // 'region.name: as region',
      `
      json_build_object(
        'id', region.id,
        'name', region.name
      ) AS region
      `,
      `
      CASE 
        WHEN user.deleted_at IS NULL THEN TRUE 
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
}
