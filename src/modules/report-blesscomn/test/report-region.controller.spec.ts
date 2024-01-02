import { Test, TestingModule } from '@nestjs/testing';
import { ReportRegionController } from '../controller/report-blesscomn.controller';
import { ReportRegionService } from '../services/report-blesscomn.service';

describe('ReportRegionController', () => {
  let controller: ReportRegionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportRegionController],
      providers: [ReportRegionService],
    }).compile();

    controller = module.get<ReportRegionController>(ReportRegionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
