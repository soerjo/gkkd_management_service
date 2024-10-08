import { forwardRef, Module } from '@nestjs/common';
import { CermonSchedulerService } from './cermon-scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportIbadahModule } from '../cermon-report/cermon-report.module';
import { AdminModule } from '../../admin/admin.module';
import { BotModule } from '../../bot/bot.module';
import { ParameterModule } from '../../parameter/parameter.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => ReportIbadahModule),
    AdminModule,
    BotModule,
    ParameterModule,
    // other dependecies...
  ],
  providers: [CermonSchedulerService],
  exports: [CermonSchedulerService],
})
export class CermonSchedulerModule {}
