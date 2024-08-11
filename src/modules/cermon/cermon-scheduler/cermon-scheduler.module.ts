import { Module } from '@nestjs/common';
import { CermonSchedulerService } from './cermon-scheduler.service';
import { CermonSchedulerController } from './cermon-scheduler.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportIbadahModule } from '../cermon-report/cermon-report.module';
import { AdminModule } from '../../admin/admin.module';
import { BotModule } from '../../bot/bot.module';
import { ParameterModule } from '../../parameter/parameter.module';

@Module({
  imports: [ScheduleModule.forRoot(), ReportIbadahModule, AdminModule, BotModule, ParameterModule],
  controllers: [CermonSchedulerController],
  providers: [CermonSchedulerService],
})
export class CermonSchedulerModule {}
