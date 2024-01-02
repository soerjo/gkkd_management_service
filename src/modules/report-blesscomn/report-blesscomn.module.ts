import { Module } from '@nestjs/common';
import { ReportBlesscomnService } from './services/report-blesscomn.service';
import { ReportBlesscomnController } from './controller/report-blesscomn.controller';
import { ReportBlesscomnRepository } from './repository/report-blesscomn.repository';

@Module({
  controllers: [ReportBlesscomnController],
  providers: [ReportBlesscomnService, ReportBlesscomnRepository],
})
export class ReportBlesscomnModule {}
