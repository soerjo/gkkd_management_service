import { Module } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { ParameterController } from './parameter.controller';

@Module({
  controllers: [ParameterController],
  providers: [ParameterService],
})
export class ParameterModule {}
