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
    queryBuilder.leftJoinAndSelect(DisciplesEntity, 'pembimbing', 'pembimbing.nim = pemuridan_report.pembimbing_nim');
    queryBuilder.leftJoinAndSelect(RegionEntity, 'region', 'region.id = pemuridan_report.region_id');

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('disciples.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
      }),
    );

    if (filter.pembimbing_nim) {
      queryBuilder.andWhere('group.pembimbing_nim = :pembimbing_nim', { pembimbing_nim: filter.pembimbing_nim });
    }

    if (filter.region_id) {
      queryBuilder.andWhere('group.region_id = :region_id', { region_id: filter.region_id });
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
