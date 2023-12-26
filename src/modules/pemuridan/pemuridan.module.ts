import { Module } from '@nestjs/common';
import { PemuridanService } from './services/pemuridan.service';
import { PemuridanController } from './controller/pemuridan.controller';
import { PemuridanRepository } from './repository/pemuridan.repository';
import { JemaatService } from '../jemaat/services/jemaat.service';

@Module({
  imports: [JemaatService],
  controllers: [PemuridanController],
  providers: [PemuridanService, PemuridanRepository],
})
export class PemuridanModule {}
