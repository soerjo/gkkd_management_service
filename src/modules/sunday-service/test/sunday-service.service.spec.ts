import { Test, TestingModule } from '@nestjs/testing';
import { SundayServiceService } from '../services/sunday-service.service';

describe('SundayServiceService', () => {
  let service: SundayServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SundayServiceService],
    }).compile();

    service = module.get<SundayServiceService>(SundayServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
