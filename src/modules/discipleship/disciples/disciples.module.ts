import { Module } from '@nestjs/common';
import { DisciplesService } from './services/disciples.service';
import { DisciplesController } from './controller/pemuridan.controller';
import { DisciplesRepository } from './repository/disciples.repository';
import { RegionModule } from '../../../modules/region/region.module';
import { AdminModule } from '../../admin/admin.module';
import { JemaatModule } from '../../jemaat/jemaat/jemaat.module';

@Module({
  imports: [RegionModule, AdminModule, JemaatModule],
  controllers: [DisciplesController],
  providers: [DisciplesService, DisciplesRepository],
  exports: [DisciplesService],
})
export class DisciplesModule {}
