import { Module } from '@nestjs/common';
import { RegionService } from './services/region.service';
import { RegionController } from './controller/region.controller';
import { RegionRepository } from './repository/region.repository';

@Module({
  controllers: [RegionController],
  providers: [RegionService, RegionRepository],
  exports: [RegionService],
})
export class RegionModule {}
