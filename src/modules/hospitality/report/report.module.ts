import { Module } from '@nestjs/common';
import { ReportService } from './services/report.service';
import { ReportController } from './controllers/report.controller';
import { HospitalityReportRepository } from './repositories/hospitality-report.repository';
import { HospitalityDataModule } from '../data/data.module';
import { JadwalIbadahModule } from '../../../modules/cermon/cermon-schedule/cermon-schedule.module';

@Module({
  imports: [
    JadwalIbadahModule,
    HospitalityDataModule,
  ],
  controllers: [ReportController],
  providers: [
    ReportService, 
    HospitalityReportRepository,
  ],
})
export class HospitalityReportModule {}
