import { Test, TestingModule } from '@nestjs/testing';
import { SundayServiceController } from '../controller/sunday-service.controller';
import { SundayServiceService } from '../services/sunday-service.service';

describe('SundayServiceController', () => {
  let controller: SundayServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SundayServiceController],
      providers: [SundayServiceService],
    }).compile();

    controller = module.get<SundayServiceController>(SundayServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
