import { Module } from '@nestjs/common';
import { ReportBlesscomnService } from './services/report-blesscomn.service';
import { ReportBlesscomnController } from './controller/report-blesscomn.controller';
import { ReportBlesscomnRepository } from './repository/report-blesscomn.repository';
import { BlesscomnModule } from '../blesscomn/blesscomn.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { RegionModule } from '../../region/region.module';

@Module({
  imports: [NestjsFormDataModule, BlesscomnModule, RegionModule],
  controllers: [ReportBlesscomnController],
  providers: [ReportBlesscomnService, ReportBlesscomnRepository],
})
export class ReportBlesscomnModule {}
