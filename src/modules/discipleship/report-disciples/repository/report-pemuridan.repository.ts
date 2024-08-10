import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { ReportPemuridanEntity } from '../entities/report-pemuridan.entity';
import { FilterDto } from '../dto/filter.dto';
import { DisciplesEntity } from '../../disciples/entities/disciples.entity';
import { RegionEntity } from '../../../region/entities/region.entity';

@Injectable()
export class ReportPemuridanRepository extends Repository<ReportPemuridanEntity> {
  constructor(private dataSource: DataSource) {
    super(ReportPemuridanEntity, dataSource.createEntityManager());
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('pemuridan_report');
    queryBuilder.leftJoinAndSelect('pemuridan_report.disciple_group', 'disciple_group');
    queryBuilder.leftJoinAndSelect('disciple_group.pembimbing', 'pembimbing');

    if (!filter.group_id && filter.region_ids.length) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('pemuridan_report.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }),
      );
    }

    if (!filter.group_id && filter.disciple_nims.length) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('disciple_group.pembimbing_nim in ( :...disciple_nims )', { disciple_nims: filter.disciple_nims });
        }),
      );
    }

    if (filter.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('disciple_group.name ILIKE :search', { search: `%${filter.search}%` });
          qb.orWhere('pembimbing.name ILIKE :search', { search: `%${filter.search}%` });
        }),
      );
    }

    if (filter.group_id) {
      queryBuilder.andWhere('disciple_group.id = :group_id', { group_id: filter.group_id });
    }

    if (filter.date_from) {
      queryBuilder.andWhere('pemuridan_report.date >= :date_from', { date_from: filter.date_from });
    }

    if (filter.date_to) {
      queryBuilder.andWhere('pemuridan_report.date <= :date_to', { date_to: filter.date_to });
    }

    if (filter.take) {
      queryBuilder.limit(filter?.take);
      queryBuilder.offset((filter?.page - 1) * filter?.take);
    }

    queryBuilder.orderBy(`pemuridan_report.created_at`, 'DESC');

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
