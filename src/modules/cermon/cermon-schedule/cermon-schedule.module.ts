import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { JadwalIbadahService } from './services/jadwal-ibadah.service';
import { JadwalIbadahController } from './controller/cermon-scedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CermonScheduleEntity } from './entities/cermon-schedule.entity';
import { CermonScheduleRepository } from './repository/cermon-schedule.repository';
import { RegionModule } from '../../region/region.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([CermonScheduleEntity]), RegionModule],
  controllers: [JadwalIbadahController],
  providers: [JadwalIbadahService, CermonScheduleRepository],
  exports: [JadwalIbadahService],
})
export class JadwalIbadahModule {}
