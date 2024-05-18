import { Module } from '@nestjs/common';
import { SundayServiceService } from './services/sunday-service.service';
import { SundayServiceController } from './controller/sunday-service.controller';
import { SundayServiceRepository } from './repository/report-pemuridan.repository';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [RegionModule],
  controllers: [SundayServiceController],
  providers: [SundayServiceService, SundayServiceRepository],
  exports: [SundayServiceService],
})
export class SundayServiceModule {}
