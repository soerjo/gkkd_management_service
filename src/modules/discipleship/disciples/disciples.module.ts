import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { DisciplesService } from './services/disciples.service';
import { DisciplesController } from './controller/pemuridan.controller';
import { DisciplesRepository } from './repository/disciples.repository';
import { RegionModule } from '../../../modules/region/region.module';
import { AdminModule } from '../../admin/admin.module';
import { JemaatModule } from '../../jemaat/jemaat/jemaat.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [RegionModule, AdminModule, JemaatModule],
  controllers: [DisciplesController],
  providers: [
    DisciplesService,
    DisciplesRepository,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
  exports: [DisciplesService],
})
export class DisciplesModule {}
