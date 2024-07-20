import { Module } from '@nestjs/common';
import { JemaatModule } from '../../../modules/jemaat/jemaat/jemaat.module';
import { RegionModule } from '../../../modules/region/region.module';
import { BlesscomnController } from './controller/blesscomn.controller';
import { BlesscomnService } from './services/blesscomn.service';
import { BlesscomnRepository } from './repository/blesscomn.repository';
import { AdminModule } from '../../admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlesscomnAdminEntity } from './entities/blesscomn-admin.entity';
import { BlesscomnEntity } from './entities/blesscomn.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlesscomnAdminEntity, BlesscomnEntity]), RegionModule, JemaatModule, AdminModule],
  controllers: [BlesscomnController],
  providers: [BlesscomnService, BlesscomnRepository],
  exports: [BlesscomnService],
})
export class BlesscomnModule {}
