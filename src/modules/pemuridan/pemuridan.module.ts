import { Module } from '@nestjs/common';
import { PemuridanService } from './pemuridan.service';
import { PemuridanController } from './pemuridan.controller';

@Module({
  controllers: [PemuridanController],
  providers: [PemuridanService],
})
export class PemuridanModule {}
