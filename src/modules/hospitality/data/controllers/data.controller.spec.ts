import { Test, TestingModule } from '@nestjs/testing';
import { DataController } from './data.controller';
import { HospitalityDataService } from '../services/data.service';

describe('DataController', () => {
  let controller: DataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataController],
      providers: [HospitalityDataService],
    }).compile();

    controller = module.get<DataController>(DataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
