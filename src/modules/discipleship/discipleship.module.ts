import { Module } from '@nestjs/common';
import { DisciplesModule } from './disciples/disciples.module';
// import { ReportDisciplesModule } from './report-disciples/report-pemuridan.module';
// import { DisciplesGroupModule } from './disciples-group/disciples.module';

@Module({
  imports: [
    DisciplesModule,
    // DisciplesGroupModule,
    // ReportDisciplesModule,
    // other module...
  ],
})
export class MainDiscipleshipModule {}
