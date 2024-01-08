import { Test, TestingModule } from '@nestjs/testing';
import { ReportRegionService } from '../services/report-region.service';
import { ReportRegionRepository } from '../repository/report-region.repository';
import { RegionService } from 'src/modules/region/services/region.service';

describe('ReportRegionService', () => {
  let service: ReportRegionService;
  let reportRegionRepository: ReportRegionRepository;
  let regionService: RegionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportRegionService,
        {
          provide: ReportRegionRepository,
          useValue: {
            findOne: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn(),
          },
        },
        {
          provide: RegionService,
          useValue: {
            getOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportRegionService>(ReportRegionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
