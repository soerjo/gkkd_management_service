import { Module } from '@nestjs/common';
import { ReportBlesscomnService } from './services/report-blesscomn.service';
import { ReportBlesscomnController } from './controller/report-blesscomn.controller';
import { ReportBlesscomnRepository } from './repository/report-blesscomn.repository';
import { BlesscomnModule } from '../blesscomn/blesscomn.module';

@Module({
  imports: [BlesscomnModule],
  controllers: [ReportBlesscomnController],
  providers: [ReportBlesscomnService, ReportBlesscomnRepository],
})
export class ReportBlesscomnModule {}
