import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import typeormConfig from 'src/config/typeorm.config';
import { RegionModule } from '../region/region.module';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LovControler } from './controller/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule,
    AuthModule,
    AdminModule,
    RegionModule,
  ],
  controllers: [LovControler],
  providers: [
    JwtAuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
