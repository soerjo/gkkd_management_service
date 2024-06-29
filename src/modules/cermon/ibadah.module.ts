import { Module } from '@nestjs/common';
import { JadwalIbadahModule } from './cermon-schedule/cermon-schedule.module';
import { ReportIbadahModule } from './cermon-report/cermon-report.module';

@Module({
  imports: [
    ReportIbadahModule,
    JadwalIbadahModule,
    //  other module...
  ],
})
export class MainCermonModule {}
