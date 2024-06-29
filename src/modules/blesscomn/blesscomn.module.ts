import { Module } from '@nestjs/common';
import { ReportBlesscomnModule } from './report-blesscomn/report-blesscomn.module';
import { BlesscomnModule } from './blesscomn/blesscomn.module';

@Module({
  imports: [
    ReportBlesscomnModule,
    BlesscomnModule,
    //  other module
  ],
})
export class MainBlesscomnModule {}
