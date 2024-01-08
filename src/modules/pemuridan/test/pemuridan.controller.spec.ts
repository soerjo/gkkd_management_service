import { Test, TestingModule } from '@nestjs/testing';
import { PemuridanController } from '../controller/pemuridan.controller';
import { PemuridanService } from '../services/pemuridan.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('PemuridanController', () => {
  let controller: PemuridanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PemuridanController],
      providers: [
        ConfigService,
        {
          provide: PemuridanService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PemuridanController>(PemuridanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
