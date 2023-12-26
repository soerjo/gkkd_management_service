import { Test, TestingModule } from '@nestjs/testing';
import { PemuridanController } from './pemuridan.controller';
import { PemuridanService } from './pemuridan.service';

describe('PemuridanController', () => {
  let controller: PemuridanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PemuridanController],
      providers: [PemuridanService],
    }).compile();

    controller = module.get<PemuridanController>(PemuridanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
