import { forwardRef, Module } from '@nestjs/common';
import { ReportBlesscomnService } from './services/report-blesscomn.service';
import { ReportBlesscomnController } from './controller/report-blesscomn.controller';
import { ReportBlesscomnRepository } from './repository/report-blesscomn.repository';
import { BlesscomnModule } from '../blesscomn/blesscomn.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { RegionModule } from '../../region/region.module';
import { BlesscomnSchedulerModule } from '../blesscomn-scheduler/blesscomn-scheduler.module';
import { GkkdServiceModule } from '../../../modules/gkkd-service/gkkd-service.module';

@Module({
  imports: [
    NestjsFormDataModule, 
    BlesscomnModule, 
    RegionModule, 
    forwardRef(() => BlesscomnSchedulerModule),
    GkkdServiceModule,
  ],
  controllers: [ReportBlesscomnController],
  providers: [ReportBlesscomnService, ReportBlesscomnRepository],
  exports: [ReportBlesscomnService],
})
export class ReportBlesscomnModule {}
