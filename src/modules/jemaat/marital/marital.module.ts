import { Module } from '@nestjs/common';
import { MaritalService } from './services/marital.service';
import { MaritalController } from './controller/marital.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaritalRecordEntity } from './entities/marital-record.entity';
import { JemaatModule } from '../jemaat/jemaat.module';
import { MaritalRepository } from './repository/marital.repository';
import { RegionModule } from '../../../modules/region/region.module';

@Module({
  imports: [TypeOrmModule.forFeature([MaritalRecordEntity]), JemaatModule, RegionModule],
  controllers: [MaritalController],
  providers: [MaritalService, MaritalRepository],
})
export class MaritalModule {}
