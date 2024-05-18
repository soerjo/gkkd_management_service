import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import typeormConfig from 'src/config/typeorm.config';
import appConfig from 'src/config/app.config';
import { RegionModule } from '../region/region.module';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LovControler } from './controller/app.controller';
import { JemaatModule } from '../jemaat/jemaat.module';
import { PemuridanModule } from '../pemuridan/pemuridan.module';
import { BlesscomnModule } from '../blesscomn/blesscomn.module';
import { ReportRegionModule } from '../report-region/report-region.module';
import { ReportBlesscomnModule } from '../report-blesscomn/report-blesscomn.module';
import { ReportPemuridanModule } from '../report-pemuridan/report-pemuridan.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { SundayServiceModule } from '../sunday-service/sunday-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    AdminModule,
    RegionModule,
    JemaatModule,
    PemuridanModule,
    BlesscomnModule,
    ReportRegionModule,
    ReportBlesscomnModule,
    ReportPemuridanModule,
    DashboardModule,
    SundayServiceModule,
  ],
  controllers: [LovControler],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    JwtAuthGuard,
  ],
})
export class AppModule {}
