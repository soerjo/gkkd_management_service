import { Test, TestingModule } from '@nestjs/testing';
import { JemaatService } from '../services/jemaat.service';
import { RegionService } from 'src/modules/region/services/region.service';
import { RegionRepository } from 'src/modules/region/repository/region.repository';
import { JemaatRepository } from '../repository/jemaat.repository';

jest.mock('../services/jemaat.service');
jest.mock('../repository/jemaat.repository');
jest.mock('../../region/services/region.service');
jest.mock('../../region/repository/region.repository');

describe('JemaatService', () => {
  let service: JemaatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JemaatService, RegionService, RegionRepository, JemaatRepository],
    }).compile();

    service = module.get<JemaatService>(JemaatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
