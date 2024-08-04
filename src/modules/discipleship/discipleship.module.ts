import { Module } from '@nestjs/common';
import { DisciplesModule } from './disciples/disciples.module';
import { DisciplesGroupModule } from './disciples-group/disciples.module';
import { ReportDisciplesModule } from './report-disciples/report-pemuridan.module';

@Module({
  imports: [
    ReportDisciplesModule,
    DisciplesModule,
    DisciplesGroupModule,
    // other module...
  ],
})
export class MainDiscipleshipModule {}
