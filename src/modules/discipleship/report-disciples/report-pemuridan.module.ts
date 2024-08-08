import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ReportPemuridanService } from './services/report-pemuridan.service';
import { ReportPemuridanController } from './controller/report-pemuridan.controller';
import { ReportPemuridanRepository } from './repository/report-pemuridan.repository';
import { DisciplesModule } from '../disciples/disciples.module';
import { RegionModule } from '../../region/region.module';
import { DisciplesGroupModule } from '../disciples-group/disciples.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [NestjsFormDataModule, DisciplesModule, RegionModule, DisciplesGroupModule],
  controllers: [ReportPemuridanController],
  providers: [
    ReportPemuridanService,
    ReportPemuridanRepository,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
})
export class ReportDisciplesModule {}
