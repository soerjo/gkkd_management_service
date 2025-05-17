import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HospitaltityDataEntity } from '../entities/hospitality-data.entity';
import { FindHospitalityData } from '../dto/find-hospitality-data.dto';

@Injectable()
export class HospitaltityDataRepository extends Repository<HospitaltityDataEntity> {
  constructor(private dataSource: DataSource) {
    super(HospitaltityDataEntity, dataSource.createEntityManager());
  }

    async getAll(filter: FindHospitalityData) {
      const queryBuilder = this.createQueryBuilder('hospitality_data');

      queryBuilder.leftJoinAndSelect('hospitality_data.region', 'region');
      queryBuilder.leftJoinAndSelect('hospitality_data.segment', 'segment');
      queryBuilder.leftJoinAndSelect('hospitality_data.blesscomn', 'blesscomn');
  
      queryBuilder.select([
        'hospitality_data.id as id',
        'hospitality_data.name as name',
        'hospitality_data.alias as alias',
        'hospitality_data.gender as gender',
        'region.id as region_id',
        'region.name as region_name',
        'segment.id as segment_id',
        'segment.name as segment_name',
        'blesscomn.id as blesscomn_id',
        'blesscomn.name as blesscomn_name',
      ]);
  
      filter.name && queryBuilder.andWhere('hospitality_data.name ILIKE :search', { search: `%${filter.name}%` });
      filter.name && queryBuilder.andWhere('hospitality_data.alias ILIKE :search', { search: `%${filter.name}%` });
      filter.region_id && queryBuilder.andWhere('hospitality_data.region_id = :region_id', { region_id: filter.region_id });
      filter.segment_id && queryBuilder.andWhere('hospitality_data.segment_id = :segment_id', { segment_id: filter.segment_id });
      filter.blesscomn_id && queryBuilder.andWhere('hospitality_data.blesscomn_id = :blesscomn_id', { blesscomn_id: filter.blesscomn_id });
  
      filter?.take && queryBuilder.limit(filter?.take);
      filter?.page && queryBuilder.offset((filter?.page - 1) * filter?.take);
  
      const entities = await queryBuilder.getRawMany();
      const itemCount = await queryBuilder.getCount();
  
      const meta = {
        page: filter?.page || 0,
        offset: filter?.take || 0,
        itemCount: itemCount || 0,
        pageCount: Math.ceil(itemCount / filter?.take) ? Math.ceil(itemCount / filter?.take) : 0,
      };
  
      return { entities, meta };
    }
}