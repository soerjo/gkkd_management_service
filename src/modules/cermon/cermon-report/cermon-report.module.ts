import { Module } from '@nestjs/common';
import { ReportIbadahService } from './services/cermon-report.service';
import { ReportIbadahController } from './controller/cermon-report.controller';

@Module({
  controllers: [ReportIbadahController],
  providers: [ReportIbadahService],
})
export class ReportIbadahModule {}
