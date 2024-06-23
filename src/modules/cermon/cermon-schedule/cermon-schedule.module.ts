import { Module } from '@nestjs/common';
import { JadwalIbadahService } from './services/jadwal-ibadah.service';
import { JadwalIbadahController } from './controller/cermon-scedule.controller';

@Module({
  controllers: [JadwalIbadahController],
  providers: [JadwalIbadahService],
})
export class JadwalIbadahModule {}
