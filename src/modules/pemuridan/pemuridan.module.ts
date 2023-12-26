import { Module } from '@nestjs/common';
import { PemuridanService } from './services/pemuridan.service';
import { PemuridanController } from './controller/pemuridan.controller';
import { PemuridanRepository } from './repository/pemuridan.repository';
import { JemaatModule } from '../jemaat/jemaat.module';

@Module({
  imports: [JemaatModule],
  controllers: [PemuridanController],
  providers: [PemuridanService, PemuridanRepository],
})
export class PemuridanModule {}
