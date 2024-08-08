import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { JadwalIbadahModule } from './cermon-schedule/cermon-schedule.module';
import { ReportIbadahModule } from './cermon-report/cermon-report.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ReportIbadahModule,
    JadwalIbadahModule,
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
