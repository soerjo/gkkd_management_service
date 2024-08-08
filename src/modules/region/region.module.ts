import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { RegionService } from './services/region.service';
import { RegionController } from './controller/region.controller';
import { RegionRepository } from './repository/region.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [RegionController],
  providers: [
    RegionService,
    RegionRepository,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
  exports: [RegionService],
})
export class RegionModule {}
