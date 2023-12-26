import { Test, TestingModule } from '@nestjs/testing';
import { BlesscomnController } from './blesscomn.controller';
import { BlesscomnService } from './blesscomn.service';

describe('BlesscomnController', () => {
  let controller: BlesscomnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlesscomnController],
      providers: [BlesscomnService],
    }).compile();

    controller = module.get<BlesscomnController>(BlesscomnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
