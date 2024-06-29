import { Module } from '@nestjs/common';
import { DisciplesService } from './services/disciples.service';
import { DisciplesController } from './controller/pemuridan.controller';
import { DisciplesRepository } from './repository/disciples.repository';
import { RegionModule } from 'src/modules/region/region.module';

@Module({
  imports: [RegionModule],
  controllers: [DisciplesController],
  providers: [DisciplesService, DisciplesRepository],
  exports: [DisciplesService],
})
export class DisciplesModule {}
