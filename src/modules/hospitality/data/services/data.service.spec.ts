import { Test, TestingModule } from '@nestjs/testing';
import { HospitalityDataService } from './data.service';

describe('DataService', () => {
  let service: HospitalityDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalityDataService],
    }).compile();

    service = module.get<HospitalityDataService>(HospitalityDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
