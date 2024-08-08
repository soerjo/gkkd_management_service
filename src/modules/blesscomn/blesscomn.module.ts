import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ReportBlesscomnModule } from './report-blesscomn/report-blesscomn.module';
import { BlesscomnModule } from './blesscomn/blesscomn.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ReportBlesscomnModule,
    BlesscomnModule,
    //  other module
  ],
})
export class MainBlesscomnModule {}
