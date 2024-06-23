import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './controller/admin.controller';
import { AdminRepository } from './repository/admin.repository';
import { RegionModule } from '../region/region.module';
import { JemaatModule } from '../jemaat/jemaat/jemaat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    RegionModule,
    JemaatModule,
    // inject other module...
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService],
})
export class AdminModule {}
