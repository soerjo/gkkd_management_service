import { Module } from '@nestjs/common';
import { BaptisanModule } from './baptisan/baptisan.module';
import { JemaatModule } from './jemaat/jemaat.module';
import { PenyerahanAnakModule } from './penyerahan-anak/penyerahan-anak.module';
import { MaritalModule } from './marital/marital.module';

@Module({
  imports: [
    JemaatModule,
    BaptisanModule,
    PenyerahanAnakModule,
    MaritalModule,
    // other module...
  ],
})
export class MainJemaatModule {}
