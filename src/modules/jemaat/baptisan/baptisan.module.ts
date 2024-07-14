import { Module } from '@nestjs/common';
import { BaptisanService } from './services/baptisan.service';
import { BaptisanController } from './controller/baptisan.controller';
import { JemaatModule } from '../jemaat/jemaat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaptismRecordEntity } from './entities/baptisan.entity';
import { BaptismRepository } from './repository/baptism.repository';
import { RegionModule } from '../../region/region.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BaptismRecordEntity]),
    JemaatModule,
    RegionModule,
    // other modules..
  ],
  controllers: [BaptisanController],
  providers: [BaptisanService, BaptismRepository],
})
export class BaptisanModule {}
