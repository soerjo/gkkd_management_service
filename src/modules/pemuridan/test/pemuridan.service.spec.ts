import { Test, TestingModule } from '@nestjs/testing';
import { PemuridanService } from '../services/pemuridan.service';
import { PemuridanRepository } from '../repository/pemuridan.repository';
import { RegionService } from 'src/modules/region/services/region.service';
import { JemaatService } from 'src/modules/jemaat/services/jemaat.service';

describe('PemuridanService', () => {
  let service: PemuridanService;

  const mockPemuridanRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PemuridanService,
        {
          provide: PemuridanRepository,
          useValue: mockPemuridanRepository,
        },
        {
          provide: RegionService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JemaatService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PemuridanService>(PemuridanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
