import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../controller/admin.controller';
import { AdminService } from '../services/admin.service';
import { RegionService } from 'src/modules/region/services/region.service';
import { AdminRepository } from '../repository/admin.repository';
import { JemaatService } from 'src/modules/jemaat/jemaat/services/jemaat.service';
import { RegionRepository } from 'src/modules/region/repository/region.repository';
import { JemaatRepository } from 'src/modules/jemaat/jemaat/repository/jemaat.repository';

jest.mock('../services/admin.service');
jest.mock('../repository/admin.repository');
jest.mock('../../region/services/region.service');
jest.mock('../../region/repository/region.repository');
jest.mock('../../jemaat/services/jemaat.service');
jest.mock('../../jemaat/repository/jemaat.repository');
jest.mock('src/common/guard/jwt-auth.guard');

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;
  let regionService: RegionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [AdminService, AdminRepository, RegionService, RegionRepository, JemaatService, JemaatRepository],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
    regionService = module.get<RegionService>(RegionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
