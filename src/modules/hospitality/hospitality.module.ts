import { Module } from '@nestjs/common';
import { ReportModule } from './report/report.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [ DataModule, ReportModule ],
})
export class HospitalityModule {}
