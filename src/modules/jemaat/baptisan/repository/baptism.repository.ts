import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { BaptismRecordEntity } from '../entities/baptisan.entity';
import { FilterDto } from '../dto/filter.dto';

export class BaptismRepository {
  constructor(
    @InjectRepository(BaptismRecordEntity)
    private readonly baptismRepo: Repository<BaptismRecordEntity>,
  ) {}

  async getAll(filter: FilterDto) {
    const queryBuilder = this.baptismRepo.createQueryBuilder('baptism');
    queryBuilder.leftJoin('baptism.jemaat', 'jemaat');
    queryBuilder.leftJoin('baptism.region', 'region');

    filter.search &&
      queryBuilder.andWhere(
        new Brackets((query) => {
          query
            .where('baptism.name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('baptism.full_name ILIKE :search', { search: `%${filter.search}%` });
        }),
      );

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('baptism.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
        qb.orWhere('baptism.region_id = :region_id', { region_id: filter.region_id });
      }),
    );

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    queryBuilder.limit(filter?.take);
    queryBuilder.offset((filter?.page - 1) * filter?.take);
    queryBuilder.orderBy(`baptism.created_at`, 'DESC');

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
