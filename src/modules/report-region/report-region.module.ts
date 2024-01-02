import { Module } from '@nestjs/common';
import { ReportRegionService } from './services/report-region.service';
import { ReportRegionController } from './controller/report-region.controller';
import { ReportRegionRepository } from './repository/report-region.repository';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [RegionModule],
  controllers: [ReportRegionController],
  providers: [ReportRegionService, ReportRegionRepository],
})
export class ReportRegionModule {}
