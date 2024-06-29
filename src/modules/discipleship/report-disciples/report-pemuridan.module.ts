import { Module } from '@nestjs/common';
import { ReportPemuridanService } from './services/report-pemuridan.service';
import { ReportPemuridanController } from './controller/report-pemuridan.controller';
import { ReportPemuridanRepository } from './repository/report-pemuridan.repository';
import { DisciplesModule } from '../disciples/disciples.module';

@Module({
  imports: [DisciplesModule],
  controllers: [ReportPemuridanController],
  providers: [ReportPemuridanService, ReportPemuridanRepository],
})
export class ReportDisciplesModule {}
