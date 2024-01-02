import { Module } from '@nestjs/common';
import { ReportPemuridanService } from './services/report-pemuridan.service';
import { ReportPemuridanController } from './controller/report-pemuridan.controller';
import { ReportPemuridanRepository } from './repository/report-pemuridan.repository';

@Module({
  controllers: [ReportPemuridanController],
  providers: [ReportPemuridanService, ReportPemuridanRepository],
})
export class ReportPemuridanModule {}
