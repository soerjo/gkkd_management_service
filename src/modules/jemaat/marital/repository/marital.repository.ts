import { InjectRepository } from '@nestjs/typeorm';
import { MaritalRecordEntity } from '../entities/marital-record.entity';
import { Brackets, Repository } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';

export class MaritalRepository {
  constructor(
    @InjectRepository(MaritalRecordEntity)
    private readonly maritalRepo: Repository<MaritalRepository>,
  ) {}

  async getAll(filter: FilterDto) {
    const queryBuilder = this.maritalRepo.createQueryBuilder('marital');
    // queryBuilder.leftJoin('marital.region', 'region');

    filter.search &&
      queryBuilder.andWhere(
        new Brackets((query) => {
          query
            .where('marital.name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('marital.full_name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('marital.email ILIKE :search', { search: `%${filter.search}%` });
        }),
      );

    filter.region_id && queryBuilder.andWhere('marital.region_id = :region_id', { region_id: filter.region_id });

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    queryBuilder.take(filter?.take);
    queryBuilder.skip((filter?.page - 1) * filter?.take);

    queryBuilder.orderBy(`marital.created_at`, 'DESC');

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
