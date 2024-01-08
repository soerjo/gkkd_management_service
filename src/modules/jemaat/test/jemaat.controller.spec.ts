import { Test, TestingModule } from '@nestjs/testing';
import { JemaatController } from '../controller/jemaat.controller';
import { JemaatService } from '../services/jemaat.service';
import { JemaatRepository } from '../repository/jemaat.repository';
import { RegionService } from 'src/modules/region/services/region.service';
import { RegionRepository } from 'src/modules/region/repository/region.repository';
import { RegionModule } from 'src/modules/region/region.module';

jest.mock('../services/jemaat.service');
jest.mock('../repository/jemaat.repository');
jest.mock('../../region/services/region.service');
jest.mock('../../region/repository/region.repository');
jest.mock('src/common/guard/jwt-auth.guard');

describe('JemaatController', () => {
  let controller: JemaatController;
  let jemaatService: JemaatService;
  let jemaatRepository: JemaatRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [RegionModule],
      controllers: [JemaatController],
      providers: [JemaatService, JemaatRepository, RegionService, RegionRepository],
    }).compile();

    controller = module.get<JemaatController>(JemaatController);
    jemaatService = module.get<JemaatService>(JemaatService);
    jemaatRepository = module.get<JemaatRepository>(JemaatRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
