import { Module } from '@nestjs/common';
import { ReportService } from './services/report.service';
import { ReportController } from './controllers/report.controller';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
