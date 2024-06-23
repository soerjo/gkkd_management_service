import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationBlesscomnService } from './organization-blesscomn.service';

describe('OrganizationBlesscomnService', () => {
  let service: OrganizationBlesscomnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationBlesscomnService],
    }).compile();

    service = module.get<OrganizationBlesscomnService>(OrganizationBlesscomnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
