import { forwardRef, Module } from '@nestjs/common';
import { ReportIbadahService } from './services/cermon-report.service';
import { ReportIbadahController } from './controller/cermon-report.controller';
import { CermonReportRepository } from './repository/cermon-report.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CermonReportEntity } from './entities/cermon-report.entity';
import { JadwalIbadahModule } from '../cermon-schedule/cermon-schedule.module';
import { RegionModule } from '../../region/region.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CermonSchedulerModule } from '../cermon-scheduler/cermon-scheduler.module';
import { GkkdServiceModule } from 'src/modules/gkkd-service/gkkd-service.module';

@Module({
  imports: [
    NestjsFormDataModule,
    TypeOrmModule.forFeature([CermonReportEntity]),
    JadwalIbadahModule,
    RegionModule,
    forwardRef(() => CermonSchedulerModule),
    GkkdServiceModule,
  ],
  controllers: [ReportIbadahController],
  providers: [ReportIbadahService, CermonReportRepository],
  exports: [ReportIbadahService],
})
export class ReportIbadahModule {}
