import { Module } from '@nestjs/common';
import { DisciplesModule } from './disciples/disciples.module';
import { ReportDisciplesModule } from './report-disciples/report-pemuridan.module';

@Module({
  imports: [DisciplesModule, ReportDisciplesModule],
})
export class MainDiscipleshipModule {}
