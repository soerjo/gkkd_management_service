import { Test, TestingModule } from '@nestjs/testing';
import { BlesscomnController } from '../controller/blesscomn.controller';
import { BlesscomnService } from '../services/blesscomn.service';
import { BlesscomnRepository } from '../repository/blesscomn.repository';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CreateBlesscomnDto } from '../dto/create-blesscomn.dto';
import { BlesscomnEntity } from '../entities/blesscomn.entity';
import { JemaatEntity } from 'src/modules/jemaat/jemaat/entities/jemaat.entity';
import { RegionEntity } from 'src/modules/region/entities/region.entity';

jest.mock('../services/blesscomn.service');
jest.mock('../repository/blesscomn.repository');
jest.mock('src/common/guard/jwt-auth.guard');

describe('BlesscomnController', () => {
  let controller: BlesscomnController;
  let blesscomnService: BlesscomnService;
  let blesscomnRepository: BlesscomnRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlesscomnController],
      providers: [BlesscomnService, BlesscomnRepository, JwtAuthGuard],
    }).compile();

    controller = module.get<BlesscomnController>(BlesscomnController);
    blesscomnService = module.get<BlesscomnService>(BlesscomnService);
    blesscomnRepository = module.get<BlesscomnRepository>(BlesscomnRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a blesscomn', async () => {
      const createDto: CreateBlesscomnDto = {
        name: 'youth',
        lead: 'soerjo',
        location: 'joglo',
        members: ['soerjo'],
      };
      const expectedResponse: BlesscomnEntity = {
        id: '',
        name: 'youth',
        lead: 'soerjo',
        location: 'joglo',
        members: ['soerjo'],
        created_at: new Date(),
        created_by: '',
        updated_at: null,
        updated_by: null,
        deleted_at: null,
        deleted_by: null,
        lead_jemaat: {} as JemaatEntity,
        region: {} as RegionEntity,
        report: null,
      };

      jest.spyOn(blesscomnService, 'create').mockResolvedValue(expectedResponse);

      const result = await controller.create(createDto);

      expect(result).toEqual({
        message: 'success',
        data: expectedResponse,
      });
    });
  });
});
