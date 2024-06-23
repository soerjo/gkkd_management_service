import { Test, TestingModule } from '@nestjs/testing';
import { ReportBlesscomnController } from '../controller/report-blesscomn.controller';
import { ReportBlesscomnService } from '../services/report-blesscomn.service';
import { ReportBlesscomnRepository } from '../repository/report-blesscomn.repository';
import { BlesscomnService } from 'src/modules/blesscomn/blesscomn/services/blesscomn.service';
import { BlesscomnRepository } from 'src/modules/blesscomn/blesscomn/repository/blesscomn.repository';

jest.mock('../services/report-blesscomn.service');
jest.mock('../repository/report-blesscomn.repository');
jest.mock('../../blesscomn/services/blesscomn.service');
jest.mock('../../blesscomn/repository/blesscomn.repository');
jest.mock('src/common/guard/jwt-auth.guard');

describe('ReportBlesscomnController', () => {
  let controller: ReportBlesscomnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportBlesscomnController],
      providers: [ReportBlesscomnService, ReportBlesscomnRepository, BlesscomnService, BlesscomnRepository],
    }).compile();

    controller = module.get<ReportBlesscomnController>(ReportBlesscomnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
