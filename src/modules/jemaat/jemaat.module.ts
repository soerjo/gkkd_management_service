import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { BaptisanModule } from './baptisan/baptisan.module';
import { JemaatModule } from './jemaat/jemaat.module';
import { PenyerahanAnakModule } from './penyerahan-anak/penyerahan-anak.module';
import { MaritalModule } from './marital/marital.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    JemaatModule,
    BaptisanModule,
    PenyerahanAnakModule,
    MaritalModule,
    // other module...
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
})
export class MainJemaatModule {}
