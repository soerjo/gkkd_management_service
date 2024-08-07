import { Module } from '@nestjs/common';
import { PenyerahanAnakService } from './services/penyerahan-anak.service';
import { PenyerahanAnakController } from './controller/penyerahan-anak.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenyerahanAnakEntity } from './entities/penyerahan-anak-record.entity';
import { JemaatModule } from '../jemaat/jemaat.module';
import { PenyerahanAnakRepository } from './repository/penyerahan-anak.repository';
import { RegionModule } from '../../../modules/region/region.module';

@Module({
  imports: [TypeOrmModule.forFeature([PenyerahanAnakEntity]), JemaatModule, RegionModule],
  controllers: [PenyerahanAnakController],
  providers: [PenyerahanAnakService, PenyerahanAnakRepository],
})
export class PenyerahanAnakModule {}
