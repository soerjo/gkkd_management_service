import { Test, TestingModule } from '@nestjs/testing';
import { ReportPemuridanController } from '../controller/report-pemuridan.controller';
import { ReportPemuridanService } from '../services/report-pemuridan.service';
import { ReportPemuridanRepository } from '../repository/report-pemuridan.repository';
import { PemuridanService } from 'src/modules/discipleship/disciples/services/pemuridan.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PemuridanRepository } from 'src/modules/discipleship/disciples/repository/pemuridan.repository';

describe('ReportPemuridanController', () => {
  let controller: ReportPemuridanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportPemuridanController],
      providers: [
        ReportPemuridanService,
        JwtService,
        ConfigService,
        { provide: PemuridanService, useValue: {} },
        { provide: PemuridanRepository, useValue: {} },
        { provide: ReportPemuridanRepository, useValue: {} },
      ],
    }).compile();

    controller = module.get<ReportPemuridanController>(ReportPemuridanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
