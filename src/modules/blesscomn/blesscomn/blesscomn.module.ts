import { Module } from '@nestjs/common';
import { JemaatModule } from 'src/modules/jemaat/jemaat/jemaat.module';
import { RegionModule } from 'src/modules/region/region.module';
import { BlesscomnController } from './controller/blesscomn.controller';
import { BlesscomnService } from './services/blesscomn.service';
import { BlesscomnRepository } from './repository/blesscomn.repository';

@Module({
  imports: [RegionModule, JemaatModule],
  controllers: [BlesscomnController],
  providers: [BlesscomnService, BlesscomnRepository],
  exports: [BlesscomnService],
})
export class BlesscomnModule {}
