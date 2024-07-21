import { Module } from '@nestjs/common';
import { ReportPemuridanService } from './services/report-pemuridan.service';
import { ReportPemuridanController } from './controller/report-pemuridan.controller';
import { ReportPemuridanRepository } from './repository/report-pemuridan.repository';
import { DisciplesModule } from '../disciples/disciples.module';
import { RegionModule } from '../../region/region.module';

@Module({
  imports: [DisciplesModule, RegionModule],
  controllers: [ReportPemuridanController],
  providers: [ReportPemuridanService, ReportPemuridanRepository],
})
export class ReportDisciplesModule {}
