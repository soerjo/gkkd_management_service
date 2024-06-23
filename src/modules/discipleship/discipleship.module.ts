import { Module } from '@nestjs/common';
import { DisciplesModule } from './disciples/disciples.module';
import { ReportDisciplesModule } from './report-disciples/report-pemuridan.module';
import { ParameterModule } from './parameter/parameter.module';
import { BooksLevelModule } from './books-level/books-level.module';

@Module({
  imports: [DisciplesModule, ReportDisciplesModule, BooksLevelModule, ParameterModule],
})
export class MainDiscipleshipModule {}
