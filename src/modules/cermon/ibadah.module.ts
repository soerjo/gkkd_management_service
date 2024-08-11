import { Module } from '@nestjs/common';
import { JadwalIbadahModule } from './cermon-schedule/cermon-schedule.module';
import { ReportIbadahModule } from './cermon-report/cermon-report.module';
import { CermonSchedulerModule } from './cermon-scheduler/cermon-scheduler.module';

@Module({
  imports: [
    ReportIbadahModule,
    JadwalIbadahModule,
    CermonSchedulerModule,
    //  other module...
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
})
export class MainCermonModule {}
