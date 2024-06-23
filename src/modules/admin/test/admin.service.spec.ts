import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../services/admin.service';
import { AdminRepository } from '../repository/admin.repository';
import { JemaatService } from 'src/modules/jemaat/jemaat/services/jemaat.service';
import { JemaatRepository } from 'src/modules/jemaat/jemaat/repository/jemaat.repository';

describe('AdminService', () => {
  let service: AdminService;

  const mockAdminRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: AdminRepository,
          useValue: mockAdminRepository,
        },
        {
          provide: JemaatService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
