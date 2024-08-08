import { AdminService } from './services/admin.service';
import { AdminController } from './controller/admin.controller';
import { AdminRepository } from './repository/admin.repository';
import { RegionModule } from '../region/region.module';
import { JemaatModule } from '../jemaat/jemaat/jemaat.module';
import { AdminEntity } from './entities/admin.entity';
import { BlesscomnModule } from '../blesscomn/blesscomn/blesscomn.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    RegionModule,
    JemaatModule,
    BlesscomnModule,
    // inject other module...
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
  exports: [AdminService],
})
export class AdminModule {}
