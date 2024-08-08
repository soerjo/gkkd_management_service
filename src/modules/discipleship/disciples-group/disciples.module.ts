import { forwardRef, Module } from '@nestjs/common';
import { DisciplesGroupService } from './services/disciples.service';
import { DisciplesGroupController } from './controller/pemuridan.controller';
import { DisciplesGroupRepository } from './repository/disciples.repository';
import { RegionModule } from '../../../modules/region/region.module';
import { DisciplesModule } from '../disciples/disciples.module';

@Module({
  imports: [RegionModule, forwardRef(() => DisciplesModule)],
  controllers: [DisciplesGroupController],
  providers: [DisciplesGroupService, DisciplesGroupRepository],
  exports: [DisciplesGroupService],
})
export class DisciplesGroupModule {}
