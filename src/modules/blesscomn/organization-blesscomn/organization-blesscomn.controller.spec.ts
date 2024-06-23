import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationBlesscomnController } from './organization-blesscomn.controller';
import { OrganizationBlesscomnService } from './organization-blesscomn.service';

describe('OrganizationBlesscomnController', () => {
  let controller: OrganizationBlesscomnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationBlesscomnController],
      providers: [OrganizationBlesscomnService],
    }).compile();

    controller = module.get<OrganizationBlesscomnController>(OrganizationBlesscomnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
