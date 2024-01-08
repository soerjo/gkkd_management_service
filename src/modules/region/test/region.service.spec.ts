import { Test, TestingModule } from '@nestjs/testing';
import { RegionService } from '../services/region.service';
import { RegionRepository } from '../repository/region.repository';

describe('RegionService', () => {
  let service: RegionService;

  const mockRegionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionService,
        {
          provide: RegionRepository,
          useValue: mockRegionRepository,
        },
      ],
    }).compile();

    service = module.get<RegionService>(RegionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
