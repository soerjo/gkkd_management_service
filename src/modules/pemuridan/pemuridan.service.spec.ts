import { Test, TestingModule } from '@nestjs/testing';
import { PemuridanService } from './pemuridan.service';

describe('PemuridanService', () => {
  let service: PemuridanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PemuridanService],
    }).compile();

    service = module.get<PemuridanService>(PemuridanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
