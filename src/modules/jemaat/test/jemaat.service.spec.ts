import { Test, TestingModule } from '@nestjs/testing';
import { JemaatService } from '../services/jemaat.service';

describe('JemaatService', () => {
  let service: JemaatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JemaatService],
    }).compile();

    service = module.get<JemaatService>(JemaatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
