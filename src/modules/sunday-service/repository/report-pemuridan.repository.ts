import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SundayServiceEntity } from '../entities/sunday-service.entity';

@Injectable()
export class SundayServiceRepository extends Repository<SundayServiceEntity> {
  constructor(private dataSource: DataSource) {
    super(SundayServiceEntity, dataSource.createEntityManager());
  }
}
