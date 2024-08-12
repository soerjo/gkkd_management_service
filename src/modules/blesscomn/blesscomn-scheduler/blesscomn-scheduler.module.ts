import { forwardRef, Module } from '@nestjs/common';
import { BlesscomnSchedulerService } from './blesscomn-scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from '../../admin/admin.module';
import { BotModule } from '../../bot/bot.module';
import { ParameterModule } from '../../parameter/parameter.module';
import { ReportBlesscomnModule } from '../report-blesscomn/report-blesscomn.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => ReportBlesscomnModule),
    AdminModule,
    BotModule,
    ParameterModule,
    // other dependecies...
  ],
  providers: [BlesscomnSchedulerService],
  exports: [BlesscomnSchedulerService],
})
export class BlesscomnSchedulerModule {}
