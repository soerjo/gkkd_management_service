import { Module } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { ParameterController } from './parameter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterEntity } from './entities/parameter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParameterEntity])],
  controllers: [ParameterController],
  providers: [ParameterService],
})
export class ParameterModule {}
