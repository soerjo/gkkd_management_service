import { Module } from '@nestjs/common';
import { JemaatService } from './services/jemaat.service';
import { JemaatController } from './controller/jemaat.controller';

@Module({
  controllers: [JemaatController],
  providers: [JemaatService],
})
export class JemaatModule {}
