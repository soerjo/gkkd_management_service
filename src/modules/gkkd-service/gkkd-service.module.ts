import { Module } from '@nestjs/common';
import { GkkdServiceService } from './services/gkkd-service.service';

@Module({
  providers: [GkkdServiceService],
  exports: [GkkdServiceService],
})
export class GkkdServiceModule {}
