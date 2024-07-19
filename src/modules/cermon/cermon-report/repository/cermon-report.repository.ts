import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FilterReportDto } from '../dto/filter.dto';
import { CermonReportEntity } from '../entities/cermon-report.entity';

@Injectable()
export class CermonReportRepository extends Repository<CermonReportEntity> {
  constructor(private dataSource: DataSource) {
    super(CermonReportEntity, dataSource.createEntityManager());
  }

  async getOne(id: number, region_id?: number) {
    const queryBuilder = this.createQueryBuilder('cermon-report');
    queryBuilder.leftJoin('cermon-report.cermon', 'cermon');
    queryBuilder.andWhere('cermon-report.id = :id', { id });
    if (region_id) {
      queryBuilder.andWhere('cermon-report.region_id = :region_id', { region_id });
    }

    queryBuilder.select([
      'cermon-report.id as id',
      'cermon-report.date as date',
      'cermon-report.total_male as total_male',
      'cermon-report.total_female as total_female',
      'cermon-report.total_new_male as total_new_male',
      'cermon-report.total_new_female as total_new_female',
      'cermon.id as cermon_id',
      'cermon.name as cermon_name',
    ]);

    return queryBuilder.getRawOne();
  }

  async getAll(filter: FilterReportDto) {
    const queryBuilder = this.createQueryBuilder('cermon-report');
    queryBuilder.leftJoin('cermon-report.cermon', 'cermon');

    filter.search &&
      queryBuilder.andWhere(
        new Brackets((query) => {
          query
            .where('cermon-report.name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('cermon-report.segment ILIKE :search', { search: `%${filter.search}%` });
        }),
      );

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('cermon-report.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
        qb.orWhere('cermon-report.region_id = :region_id', { region_id: filter.region_id });
      }),
    );

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    if (filter.date_to) {
      queryBuilder.andWhere(`cermon-report.date <= :date_to`, { date_to: filter.date_to });
    }

    if (filter.date_from) {
      queryBuilder.andWhere(`cermon-report.date >= :date_from`, { date_from: filter.date_from });
    }

    queryBuilder.limit(filter?.take);
    queryBuilder.offset((filter?.page - 1) * filter?.take);
    queryBuilder.addOrderBy(`cermon-report.date`, 'DESC');
    queryBuilder.addOrderBy(`cermon-report.created_at`, 'DESC');

    queryBuilder.select([
      'cermon-report.id as id',
      'cermon-report.date as date',
      'cermon-report.total_male as total_male',
      'cermon-report.total_female as total_female',
      'cermon-report.total_new_male as total_new_male',
      'cermon-report.total_new_female as total_new_female',
      'cermon.id as cermon_id',
      'cermon.name as cermon_name',
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
