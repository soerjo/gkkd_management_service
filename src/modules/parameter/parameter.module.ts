import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ParameterService } from './services/parameter.service';
import { ParameterController } from './controller/parameter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterEntity } from './entities/parameter.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([ParameterEntity])],
  controllers: [ParameterController],
  providers: [
    ParameterService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
  exports: [ParameterService],
})
export class ParameterModule {}
