import { Module } from '@nestjs/common';
import { HospitalityDataService } from './services/data.service';
import { DataController } from './controllers/data.controller';
import { HospitaltityDataRepository } from './repositories/hospitality-data.repository';
import { BlesscomnModule } from '../../../modules/blesscomn/blesscomn/blesscomn.module';
import { SegmentModule } from '../../../modules/segment/segment.module';

@Module({
  imports: [
    BlesscomnModule,
    SegmentModule,
  ],
  controllers: [DataController],
  providers: [HospitalityDataService, HospitaltityDataRepository],
  exports: [HospitalityDataService],
})
export class HospitalityDataModule {}
