import { Module } from '@nestjs/common';
import { JemaatService } from './services/jemaat.service';
import { JemaatController } from './controller/jemaat.controller';
import { JemaatRepository } from './repository/jemaat.repository';
import { RegionModule } from 'src/modules/region/region.module';

@Module({
  imports: [RegionModule],
  controllers: [JemaatController],
  providers: [JemaatService, JemaatRepository],
  exports: [JemaatService],
})
export class JemaatModule {}
