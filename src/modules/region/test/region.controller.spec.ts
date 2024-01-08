import { Test, TestingModule } from '@nestjs/testing';
import { RegionController } from '../controller/region.controller';
import { RegionService } from '../services/region.service';
import { RegionRepository } from '../repository/region.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('RegionController', () => {
  let controller: RegionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionController],
      providers: [
        RegionService,
        ConfigService,
        {
          provide: RegionRepository,
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RegionController>(RegionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
