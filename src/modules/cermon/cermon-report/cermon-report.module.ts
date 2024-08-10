import { Module } from '@nestjs/common';
import { ReportIbadahService } from './services/cermon-report.service';
import { ReportIbadahController } from './controller/cermon-report.controller';
import { CermonReportRepository } from './repository/cermon-report.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CermonReportEntity } from './entities/cermon-report.entity';
import { JadwalIbadahModule } from '../cermon-schedule/cermon-schedule.module';
import { RegionModule } from '../../region/region.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [NestjsFormDataModule, TypeOrmModule.forFeature([CermonReportEntity]), JadwalIbadahModule, RegionModule],
  controllers: [ReportIbadahController],
  providers: [ReportIbadahService, CermonReportRepository],
})
export class ReportIbadahModule {}
