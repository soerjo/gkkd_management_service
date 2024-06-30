import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdminEntity } from '../entities/admin.entity';
import { FilterDto } from '../dto/filter.dto';
import { RoleEnum } from 'src/common/constant/role.constant';

@Injectable()
export class AdminRepository extends Repository<AdminEntity> {
  constructor(private dataSource: DataSource) {
    super(AdminEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.region', 'region');
    queryBuilder.where('user.role != :role', { role: RoleEnum.ROLE_SYSTEMADMIN });

    filter.search &&
      queryBuilder.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${filter.search}%` });

    filter.region_id && queryBuilder.andWhere('region.id = :region_id', { region_id: filter.region_id });

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    queryBuilder.take(filter?.take);
    queryBuilder.orderBy(`user.created_at`, 'DESC');
    queryBuilder.skip((filter?.page - 1) * filter?.take);

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
