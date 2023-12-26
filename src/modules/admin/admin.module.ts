import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './controller/admin.controller';
import { AdminRepository } from './repository/admin.repository';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [RegionModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService],
})
export class AdminModule {}
