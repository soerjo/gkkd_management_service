import { Module } from '@nestjs/common';
import { ReportRegionService } from './services/report-region.service';
import { ReportRegionController } from './controller/report-region.controller';
import { ReportRegionRepository } from './repository/report-region.repository';

@Module({
  controllers: [ReportRegionController],
  providers: [ReportRegionService, ReportRegionRepository],
})
export class ReportRegionModule {}
