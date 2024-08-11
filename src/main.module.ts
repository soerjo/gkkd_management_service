import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import appConfig from './config/app.config';

import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { FilesModule } from './modules/files/files.module';
import { ParameterModule } from './modules/parameter/parameter.module';
import { RegionModule } from './modules/region/region.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { HttpExceptionFilter } from './common/interceptor/http-exception.interceptor';
import { MainJemaatModule } from './modules/jemaat/jemaat.module';
import { MainCermonModule } from './modules/cermon/ibadah.module';
import { MainBlesscomnModule } from './modules/blesscomn/blesscomn.module';
import { MainDiscipleshipModule } from './modules/discipleship/discipleship.module';
import { ExampleModule } from './modules/example/example.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { BotModule } from './modules/bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('typeorm'),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    MainBlesscomnModule,
    RegionModule,
    ParameterModule,
    FilesModule,
    MainJemaatModule,
    MainCermonModule,
    MainDiscipleshipModule,
    AdminModule,
    ExampleModule,
    BotModule,
    // other module...
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
