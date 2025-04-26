import { Test, TestingModule } from '@nestjs/testing';
import { GkkdServiceService } from './gkkd-service.service';

describe('GkkdServiceService', () => {
  let service: GkkdServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GkkdServiceService],
    }).compile();

    service = module.get<GkkdServiceService>(GkkdServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
