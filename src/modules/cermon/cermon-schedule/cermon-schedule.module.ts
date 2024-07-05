import { Module } from '@nestjs/common';
import { JadwalIbadahService } from './services/jadwal-ibadah.service';
import { JadwalIbadahController } from './controller/cermon-scedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CermonScheduleEntity } from './entities/cermon-schedule.entity';
import { CermonScheduleRepository } from './repository/cermon-schedule.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CermonScheduleEntity])],
  controllers: [JadwalIbadahController],
  providers: [JadwalIbadahService, CermonScheduleRepository],
  exports: [JadwalIbadahService],
})
export class JadwalIbadahModule {}
