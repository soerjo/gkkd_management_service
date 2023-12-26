import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [JwtModule, AdminModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
