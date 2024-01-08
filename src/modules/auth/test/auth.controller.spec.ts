import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/modules/admin/services/admin.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ConfigService, JwtService, { provide: AdminService, useValue: {} }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
