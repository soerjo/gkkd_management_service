import { Test, TestingModule } from '@nestjs/testing';
import { ReportRegionService } from '../services/report-region.service';

describe('ReportRegionService', () => {
  let service: ReportRegionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportRegionService],
    }).compile();

    service = module.get<ReportRegionService>(ReportRegionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
