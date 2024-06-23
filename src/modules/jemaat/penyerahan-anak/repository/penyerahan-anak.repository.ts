import { InjectRepository } from '@nestjs/typeorm';
import { PenyerahanAnakEntity } from '../entities/penyerahan-anak-record.entity';
import { Brackets, Repository } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';

export class PenyerahanAnakRepository {
  constructor(
    @InjectRepository(PenyerahanAnakEntity)
    private readonly penyerahanRepo: Repository<PenyerahanAnakEntity>,
  ) {}

  async getAll(filter: FilterDto) {
    const queryBuilder = this.penyerahanRepo.createQueryBuilder('penyerahan_anak');
    queryBuilder.leftJoin('penyerahan_anak.father', 'father');
    queryBuilder.leftJoin('penyerahan_anak.mother', 'mother');

    if (filter.search) {
      queryBuilder.andWhere(
        new Brackets((query) => {
          query
            .where('penyerahan_anak.name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('penyerahan_anak.full_name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('penyerahan_anak.father_name ILIKE :search', { search: `%${filter.search}%` })
            .orWhere('penyerahan_anak.mother_name ILIKE :search', { search: `%${filter.search}%` });
        }),
      );
    }

    if (filter.region_id) {
      queryBuilder.andWhere('penyerahan_anak.region_id = :region_id', { region_id: filter.region_id });
    }

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    queryBuilder.take(filter?.take);
    queryBuilder.skip((filter?.page - 1) * filter?.take);
    queryBuilder.orderBy(`penyerahan_anak.created_at`, 'DESC');

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
