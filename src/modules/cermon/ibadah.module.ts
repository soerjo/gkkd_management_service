import { Module } from '@nestjs/common';
import { JadwalIbadahModule } from './cermon-schedule/cermon-schedule.module';
import { ReportIbadahModule } from './cermon-report/cermon-report.module';

@Module({
  imports: [JadwalIbadahModule, ReportIbadahModule],
})
export class MainCermonModule {}
