import { InjectRepository } from '@nestjs/typeorm';
import { PenyerahanAnakEntity } from '../entities/penyerahan-anak-record.entity';
import { Brackets, Repository } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';
import { JemaatEntity } from '../../jemaat/entities/jemaat.entity';

export class PenyerahanAnakRepository {
  constructor(
    @InjectRepository(PenyerahanAnakEntity)
    private readonly penyerahanRepo: Repository<PenyerahanAnakEntity>,
  ) {}

  async getAll(filter: FilterDto) {
    const queryBuilder = this.penyerahanRepo.createQueryBuilder('penyerahan_anak');
    queryBuilder.leftJoin(JemaatEntity, 'father', 'father.nij = penyerahan_anak.father_nij');
    queryBuilder.leftJoin(JemaatEntity, 'mother', 'mother.nij = penyerahan_anak.mother_nij');

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

    queryBuilder.andWhere(
      new Brackets((qb) => {
        if (filter.region_ids.length) {
          qb.where('penyerahan_anak.region_id in ( :...region_ids )', { region_ids: filter.region_ids });
        }
        qb.orWhere('penyerahan_anak.region_id = :region_id', { region_id: filter.region_id });
      }),
    );

    if (!filter.take) {
      const entities = await queryBuilder.getMany();
      return { entities };
    }

    queryBuilder.limit(filter?.take);
    queryBuilder.offset((filter?.page - 1) * filter?.take);
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
