import { Test, TestingModule } from '@nestjs/testing';
import { ReportRegionController } from '../controller/report-region.controller';
import { ReportRegionService } from '../services/report-region.service';
import { ReportRegionRepository } from '../repository/report-region.repository';
import { RegionModule } from 'src/modules/region/region.module';
import { RegionService } from 'src/modules/region/services/region.service';
import { RegionRepository } from 'src/modules/region/repository/region.repository';

jest.mock('../services/report-region.service');
jest.mock('../repository/report-region.repository');
jest.mock('../../region/services/region.service');
jest.mock('../../region/repository/region.repository');
jest.mock('../services/report-region.service');
jest.mock('src/common/guard/jwt-auth.guard');

describe('ReportRegionController', () => {
  let controller: ReportRegionController;
  let reportRegionService: ReportRegionService;
  let reportRegionRepository: ReportRegionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportRegionController],
      providers: [ReportRegionService, ReportRegionRepository, RegionService, RegionRepository],
    }).compile();

    controller = module.get<ReportRegionController>(ReportRegionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
