import { Module } from '@nestjs/common';
import { HospitalityReportModule } from './report/report.module';
import { HospitalityDataModule } from './data/data.module';

@Module({
  imports: [ 
    HospitalityDataModule, 
    HospitalityReportModule,
   ],
})
export class HospitalityModule {}
