import { Module } from '@nestjs/common';
import { DisciplesGroupService } from './services/disciples.service';
import { DisciplesGroupController } from './controller/pemuridan.controller';
import { DisciplesGroupRepository } from './repository/disciples.repository';
import { RegionModule } from 'src/modules/region/region.module';

@Module({
  imports: [RegionModule],
  controllers: [DisciplesGroupController],
  providers: [DisciplesGroupService, DisciplesGroupRepository],
  exports: [DisciplesGroupService],
})
export class DisciplesGroupModule {}
