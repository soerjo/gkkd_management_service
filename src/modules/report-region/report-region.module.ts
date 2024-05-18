import { Module } from '@nestjs/common';
import { ReportRegionService } from './services/report-region.service';
import { ReportRegionController } from './controller/report-region.controller';
import { ReportRegionRepository } from './repository/report-region.repository';
import { RegionModule } from '../region/region.module';
import { SundayServiceModule } from '../sunday-service/sunday-service.module';

@Module({
  imports: [RegionModule, SundayServiceModule],
  controllers: [ReportRegionController],
  providers: [ReportRegionService, ReportRegionRepository],
})
export class ReportRegionModule {}
