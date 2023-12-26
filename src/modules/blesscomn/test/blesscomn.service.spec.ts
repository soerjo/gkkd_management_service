import { Test, TestingModule } from '@nestjs/testing';
import { BlesscomnService } from '../services/blesscomn.service';

describe('BlesscomnService', () => {
  let service: BlesscomnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlesscomnService],
    }).compile();

    service = module.get<BlesscomnService>(BlesscomnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
