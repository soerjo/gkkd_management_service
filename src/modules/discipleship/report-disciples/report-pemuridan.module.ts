import { Module } from '@nestjs/common';
import { ReportPemuridanService } from './services/report-pemuridan.service';
import { ReportPemuridanController } from './controller/report-pemuridan.controller';
import { ReportPemuridanRepository } from './repository/report-pemuridan.repository';
import { DisciplesModule } from '../disciples/disciples.module';
import { RegionModule } from '../../region/region.module';
import { DisciplesGroupModule } from '../disciples-group/disciples.module';

@Module({
  imports: [DisciplesModule, RegionModule, DisciplesGroupModule],
  controllers: [ReportPemuridanController],
  providers: [ReportPemuridanService, ReportPemuridanRepository],
})
export class ReportDisciplesModule {}
