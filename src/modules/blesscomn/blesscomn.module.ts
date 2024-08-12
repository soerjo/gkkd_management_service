import { Module } from '@nestjs/common';
import { ReportBlesscomnModule } from './report-blesscomn/report-blesscomn.module';
import { BlesscomnModule } from './blesscomn/blesscomn.module';
import { BlesscomnSchedulerModule } from './blesscomn-scheduler/blesscomn-scheduler.module';

@Module({
  imports: [
    ReportBlesscomnModule,
    BlesscomnModule,
    BlesscomnSchedulerModule,
    //  other module
  ],
})
export class MainBlesscomnModule {}
