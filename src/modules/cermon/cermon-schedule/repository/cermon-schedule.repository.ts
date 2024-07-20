import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CermonScheduleEntity } from '../entities/cermon-schedule.entity';
import { FilterJadwalIbadahDto } from '../dto/filter.dto';
import { RegionEntity } from '../../../../modules/region/entities/region.entity';

@Injectable()
export class CermonScheduleRepository extends Repository<CermonScheduleEntity> {
  constructor(private dataSource: DataSource) {
    super(CermonScheduleEntity, dataSource.createEntityManager());
  }

  async getOne(id: number, region_id?: number) {
    const queryBuilder = this.createQueryBuilder('cermon-schedule');
    queryBuilder.leftJoinAndSelect(RegionEntity, 'region', 'region.id = cermon-schedule.region_id');
    queryBuilder.andWhere('cermon-schedule.id = :id', { id });
    if (region_id) {
      queryBuilder.andWhere('region.id = :region_id', { region_id });
    }

    queryBuilder.select([
      'cermon-schedule.id as id',
      'cermon-schedule.name as name',
      'cermon-schedule.time as time',
      'cermon-schedule.day as day',
      'cermon-schedule.segment as segment',
      'cermon-schedule.description as description',
      'region.id as region_id',
      'region.name as region_name',
    ]);

    return queryBuilder.getRawOne();
  }

  async getAll(filter: FilterJadwalIbadahDto) {
    const queryBuilder = this.createQueryBuilder('cermon-schedule');
    queryBuilder.leftJoinAndSelect(RegionEntity, 'region', 'region.id = cermon-schedule.region_id');

    filter.search &&
      queryBuilder.andWhere(
        new Brackets((query) => {
          query
            .where('cermon-schedule.name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('cermon-schedule.segment ILIKE :search', { search: `%${filter.search}%` });
        }),
      );

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('cermon-schedule.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
        qb.orWhere('cermon-schedule.region_id = :region_id', { region_id: filter.region_id });
      }),
    );

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    queryBuilder.limit(filter?.take);
    queryBuilder.offset((filter?.page - 1) * filter?.take);
    queryBuilder.orderBy(`cermon-schedule.created_at`, 'DESC');

    queryBuilder.select([
      'cermon-schedule.id as id',
      'cermon-schedule.name as name',
      'cermon-schedule.time as time',
      'cermon-schedule.day as day',
      'cermon-schedule.segment as segment',
      'cermon-schedule.description as description',
      'region.id as region_id',
      'region.name as region_name',
    ]);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getRawMany();

    const meta = {
      page: filter?.page || 0,
      offset: filter?.take || 0,
      itemCount: itemCount || 0,
      pageCount: Math.ceil(itemCount / filter?.take) ? Math.ceil(itemCount / filter?.take) : 0,
    };

    return { entities, meta };
  }
}
