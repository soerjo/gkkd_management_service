import { Module } from '@nestjs/common';
import { BaptisanService } from './services/baptisan.service';
import { BaptisanController } from './controller/baptisan.controller';
import { JemaatModule } from '../jemaat/jemaat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaptismRecordEntity } from './entities/baptisan.entity';
import { BaptismRepository } from './repository/baptism.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BaptismRecordEntity]),
    JemaatModule,
    // other modules..
  ],
  controllers: [BaptisanController],
  providers: [BaptisanService, BaptismRepository],
})
export class BaptisanModule {}
