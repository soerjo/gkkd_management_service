import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';
import { DisciplesGroupEntity } from '../entities/disciples-group.entity';

@Injectable()
export class DisciplesGroupRepository extends Repository<DisciplesGroupEntity> {
  constructor(private dataSource: DataSource) {
    super(DisciplesGroupEntity, dataSource.createEntityManager());
  }

  async getByPembimbingNim(pembimbing_nim: string) {
    const queryBuilder = this.createQueryBuilder('group');
    queryBuilder.leftJoinAndSelect('group.pembimbing', 'pembimbing');
    queryBuilder.leftJoinAndSelect('group.region', 'region');

    queryBuilder.andWhere('group.pembimbing_nim = :pembimbing_nim', { pembimbing_nim });
    return queryBuilder.getMany();
  }

  async getOneById(id: number) {
    const queryBuilder = this.createQueryBuilder('group');
    queryBuilder.leftJoinAndSelect('group.pembimbing', 'pembimbing');
    queryBuilder.leftJoinAndSelect('group.region', 'region');
    queryBuilder.leftJoinAndSelect('group.anggota', 'anggota');
    // anggota

    queryBuilder.andWhere('group.id = :id', { id });
    return queryBuilder.getOne();
  }

  async getAll(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('group');
    queryBuilder.leftJoinAndSelect('group.pembimbing', 'pembimbing');
    queryBuilder.leftJoinAndSelect('group.region', 'region');

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('group.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
      }),
    );

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.disciple_nims.length) {
          qb.where('group.pembimbing_nim in ( :...disciple_nims )', { disciple_nims: filter.disciple_nims });
        }
      }),
    );

    filter.search &&
      queryBuilder.andWhere(
        '(group.name ILIKE :search OR pembimbing.name ILIKE :search OR group.unique_id ILIKE :search)',
        {
          search: `%${filter.search}%`,
        },
      );

    if (filter.region_id) {
      queryBuilder.andWhere('group.region_id = :region_id', { region_id: filter.region_id });
    }

    if (filter.take) {
      queryBuilder.limit(filter?.take);
      queryBuilder.offset((filter?.page - 1) * filter?.take);
      queryBuilder.orderBy(`group.created_at`, 'DESC');
    }

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
