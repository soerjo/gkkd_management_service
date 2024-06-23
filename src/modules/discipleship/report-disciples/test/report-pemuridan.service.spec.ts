import { Test, TestingModule } from '@nestjs/testing';
import { ReportPemuridanService } from '../services/report-pemuridan.service';
import { ReportPemuridanRepository } from '../repository/report-pemuridan.repository';
import { PemuridanService } from 'src/modules/discipleship/disciples/services/pemuridan.service';

describe('ReportPemuridanService', () => {
  let service: ReportPemuridanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportPemuridanService,
        { provide: PemuridanService, useValue: {} },
        { provide: ReportPemuridanRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<ReportPemuridanService>(ReportPemuridanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
