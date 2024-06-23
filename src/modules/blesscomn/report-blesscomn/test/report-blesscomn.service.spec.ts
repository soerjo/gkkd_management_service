import { Test, TestingModule } from '@nestjs/testing';
import { ReportBlesscomnService } from '../services/report-blesscomn.service';
import { ReportBlesscomnRepository } from '../repository/report-blesscomn.repository';
import { BlesscomnService } from 'src/modules/blesscomn/blesscomn/services/blesscomn.service';
import { BlesscomnRepository } from 'src/modules/blesscomn/blesscomn/repository/blesscomn.repository';

jest.mock('../services/report-blesscomn.service');
jest.mock('../repository/report-blesscomn.repository');
jest.mock('../../blesscomn/services/blesscomn.service');
jest.mock('../../blesscomn/repository/blesscomn.repository');

describe('ReportBlesscomnService', () => {
  let service: ReportBlesscomnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportBlesscomnService, ReportBlesscomnRepository, BlesscomnService, BlesscomnRepository],
    }).compile();

    service = module.get<ReportBlesscomnService>(ReportBlesscomnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
