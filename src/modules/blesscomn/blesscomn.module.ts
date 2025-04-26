import { Module } from '@nestjs/common';
import { ReportBlesscomnModule } from './report-blesscomn/report-blesscomn.module';
import { BlesscomnModule } from './blesscomn/blesscomn.module';
import { BlesscomnSchedulerModule } from './blesscomn-scheduler/blesscomn-scheduler.module';
import { GkkdServiceModule } from '../gkkd-service/gkkd-service.module';

@Module({
  imports: [
    ReportBlesscomnModule,
    BlesscomnModule,
    BlesscomnSchedulerModule,
    //  other module
  ],
})
export class MainBlesscomnModule {}
