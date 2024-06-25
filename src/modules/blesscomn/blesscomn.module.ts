import { Module } from '@nestjs/common';
import { ReportBlesscomnModule } from './report-blesscomn/report-blesscomn.module';

@Module({
  imports: [BlesscomnModule, ReportBlesscomnModule],
})
export class BlesscomnModule {}
