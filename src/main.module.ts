import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import typeormConfig from 'src/config/typeorm.config';
import appConfig from 'src/config/app.config';

import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { FilesModule } from './modules/files/files.module';
import { ParameterModule } from './modules/parameter/parameter.module';
import { RegionModule } from './modules/region/region.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { HttpExceptionFilter } from './common/interceptor/http-exception.interceptor';
import { MainJemaatModule } from './modules/jemaat/jemaat.module';
import { MainCermonModule } from './modules/cermon/ibadah.module';
import { MainBlesscomnModule } from './modules/blesscomn/blesscomn.module';
import { MainDiscipleshipModule } from './modules/discipleship/discipleship.module';
import { MemberModule } from './modules/pastor/member/member.module';
import { OrganizationModule } from './modules/pastor/organization/organization.module';
import { MissionModule } from './modules/mission/mission/mission.module';
import { MissionerModule } from './modules/mission/missioner/missioner.module';
import { DocumentationModule } from './modules/mission/documentation/documentation.module';
import { OrganizationModule } from './modules/mission/organization/organization.module';
import { EmployeeModule } from './modules/office/employee/employee.module';
import { ThinkModule } from './modules/office/think/think.module';
import { OrganizationModule } from './modules/office/organization/organization.module';

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
    ParameterModule,
    FilesModule,
    MainJemaatModule,
    MainCermonModule,
    MainBlesscomnModule,
    MainDiscipleshipModule,
    MemberModule,
    OrganizationModule,
    MissionModule,
    MissionerModule,
    DocumentationModule,
    EmployeeModule,
    ThinkModule,
    // other module...
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
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
