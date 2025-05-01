import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SegmentEntity } from '../entities/segment.entity';

@Injectable()
export class SegmentRepository extends Repository<SegmentEntity> {
  constructor(private dataSource: DataSource) {
    super(SegmentEntity, dataSource.createEntityManager());
  }

}
