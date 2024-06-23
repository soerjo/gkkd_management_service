import { Test, TestingModule } from '@nestjs/testing';
import { BlesscomnService } from '../services/blesscomn.service';
import { BlesscomnRepository } from '../repository/blesscomn.repository';
import { RegionRepository } from 'src/modules/region/repository/region.repository';
import { RegionService } from 'src/modules/region/services/region.service';
import { JemaatService } from 'src/modules/jemaat/jemaat/services/jemaat.service';
import { JemaatRepository } from 'src/modules/jemaat/jemaat/repository/jemaat.repository';
import { RegionEntity } from 'src/modules/region/entities/region.entity';
import { JemaatEntity } from 'src/modules/jemaat/jemaat/entities/jemaat.entity';
import { BlesscomnEntity } from '../entities/blesscomn.entity';
import { CreateBlesscomnDto } from '../dto/create-blesscomn.dto';
import { CreateReportBlesscomnDto } from 'src/modules/blesscomn/report-blesscomn/dto/create-report-blesscomn.dto';

jest.mock('../services/blesscomn.service');
jest.mock('../repository/blesscomn.repository');
jest.mock('../../region/services/region.service');
jest.mock('../../region/repository/region.repository');
jest.mock('../../jemaat/services/jemaat.service');
jest.mock('../../jemaat/repository/jemaat.repository');

describe('BlesscomnService', () => {
  let service: BlesscomnService;
  let blesscomnRepository: BlesscomnRepository;
  let regionService: RegionService;
  let jemaatService: JemaatService;

  const mockRegionService = {
    getOneById: jest.fn().mockImplementation((id: string) => Promise.resolve({ id } as RegionEntity)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlesscomnService,
        BlesscomnRepository,
        // RegionService,
        {
          provide: RegionService,
          useValue: mockRegionService,
        },
        RegionRepository,
        JemaatService,
        JemaatRepository,
      ],
    }).compile();

    service = module.get<BlesscomnService>(BlesscomnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
