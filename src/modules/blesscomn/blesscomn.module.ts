import { Module } from '@nestjs/common';
import { BlesscomnService } from './services/blesscomn.service';
import { BlesscomnController } from './controller/blesscomn.controller';
import { BlesscomnRepository } from './repository/blesscomn.repository';
import { RegionModule } from '../region/region.module';
import { JemaatModule } from '../jemaat/jemaat.module';

@Module({
  imports: [RegionModule, JemaatModule],
  controllers: [BlesscomnController],
  providers: [BlesscomnService, BlesscomnRepository],
  exports: [BlesscomnService]
})
export class BlesscomnModule {}
