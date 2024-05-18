import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SundayServiceEntity } from '../entities/sunday-service.entity';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class SundayServiceRepository extends Repository<SundayServiceEntity> {
  constructor(private dataSource: DataSource) {
    super(SundayServiceEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('sunday_service');
    queryBuilder.leftJoinAndSelect('sunday_service.region', 'region');

    if (filter.search) {
      queryBuilder.andWhere('region.id ILIKE :search', { search: filter.search });
    }

    if (filter.region_id) {
      queryBuilder.andWhere('region.id = :region_id', { region_id: filter.region_id });
    }

    if (filter.take) {
      queryBuilder.take(filter?.take);
      queryBuilder.skip((filter?.page - 1) * filter?.take);
    }

    queryBuilder.orderBy('sunday_service.created_at', 'DESC');

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
