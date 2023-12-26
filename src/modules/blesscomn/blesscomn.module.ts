import { Module } from '@nestjs/common';
import { BlesscomnService } from './blesscomn.service';
import { BlesscomnController } from './blesscomn.controller';

@Module({
  controllers: [BlesscomnController],
  providers: [BlesscomnService],
})
export class BlesscomnModule {}
