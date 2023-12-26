import { Module } from '@nestjs/common';
import { BlesscomnService } from './services/blesscomn.service';
import { BlesscomnController } from './controller/blesscomn.controller';
import { BlesscomnRepository } from './repository/blesscomn.repository';

@Module({
  controllers: [BlesscomnController],
  providers: [BlesscomnService, BlesscomnRepository],
})
export class BlesscomnModule {}
