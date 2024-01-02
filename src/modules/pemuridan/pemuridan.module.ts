import { Module } from '@nestjs/common';
import { PemuridanService } from './services/pemuridan.service';
import { PemuridanController } from './controller/pemuridan.controller';
import { PemuridanRepository } from './repository/pemuridan.repository';
import { JemaatModule } from '../jemaat/jemaat.module';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [JemaatModule, RegionModule],
  controllers: [PemuridanController],
  providers: [PemuridanService, PemuridanRepository],
})
export class PemuridanModule {}
