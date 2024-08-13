import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlesscomnDto } from '../dto/create-blesscomn.dto';
import { UpdateBlesscomnDto } from '../dto/update-blesscomn.dto';
import { BlesscomnRepository } from '../repository/blesscomn.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from '../../../../modules/region/services/region.service';
import { IsNull, Repository } from 'typeorm';
import { CreateAdminBlesscomnDto } from '../dto/create-admin-blesscomn.dto';
import { AdminService } from '../../../admin/services/admin.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BlesscomnAdminEntity } from '../entities/blesscomn-admin.entity';
import { Transactional } from 'typeorm-transactional';
import { last } from 'rxjs';

@Injectable()
export class BlesscomnService {
  constructor(
    @InjectRepository(BlesscomnAdminEntity)
    private readonly blesscomnAdminRepo: Repository<BlesscomnAdminEntity>,

    private readonly blesscomnRepository: BlesscomnRepository,
    private readonly regionService: RegionService,
  ) {}

  @Transactional()
  async createAdminBlesscomn(dto: CreateAdminBlesscomnDto) {
    const blesscomnAdminData: BlesscomnAdminEntity[] = [];
    for (const blesscomn_id of dto.blesscomn_ids) {
      const blesscomn = await this.blesscomnRepository.findOne({ where: { id: blesscomn_id } });
      if (!blesscomn) throw new BadRequestException('blesscomn is not found!');

      blesscomnAdminData.push(
        this.blesscomnAdminRepo.create({
          admin_id: dto.admin_id,
          blesscomn: blesscomn,
        }),
      );
    }

    await this.blesscomnAdminRepo.delete({ admin_id: dto.admin_id });
    await this.blesscomnAdminRepo.save(blesscomnAdminData);
  }

  async addAdminBlesscomn(admin_id: number, blesscomn_id: number) {
    const blesscomn = await this.blesscomnRepository.findOne({ where: { id: blesscomn_id } });
    if (!blesscomn) throw new BadRequestException('blesscomn is not found!');

    const blesscomnAdminData = this.blesscomnAdminRepo.create({
      admin_id: admin_id,
      blesscomn: blesscomn,
    });

    await this.blesscomnAdminRepo.save(blesscomnAdminData);
  }

  @Transactional()
  async create(dto: CreateBlesscomnDto) {
    const region = await this.regionService.getOneById(dto.region_id);
    if (!region) {
      throw new BadRequestException('Region is not found!');
    }
    dto.region = region;

    const isBlesscomnNameExist = await this.blesscomnRepository.findOne({
      where: {
        name: dto.name,
        region: {
          id: dto.region_id,
        },
      },
    });

    if (isBlesscomnNameExist) {
      throw new BadRequestException(`blesscomn name is already exist in region ${region.name}`);
    }

    const createBlesscomn = this.blesscomnRepository.create(dto);
    const blesscomn = await this.blesscomnRepository.save(createBlesscomn);

    await this.addAdminBlesscomn(dto.admin_id, blesscomn.id);

    return blesscomn;
  }

  async findAll(filter: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_tree_id });
    filter.region_ids = regions.map((data) => data.id);
    filter.region_ids.push(filter.region_tree_id);

    return this.blesscomnRepository.getAll(filter);
  }

  async findOne(id: number) {
    const data = await this.blesscomnRepository.getOne(id);
    if (!data) return;

    return {
      ...data,
      members: data?.members?.split(','),
    };
  }

  findOneByLeadId(leadId: number) {
    return this.blesscomnRepository.getBlesscomnByAdminId(leadId);
  }

  async update(id: number, dto: UpdateBlesscomnDto) {
    const blesscomn = await this.findOne(id);
    if (!blesscomn) throw new BadRequestException('blesscomn is not found!');
    if (dto.admin_id && blesscomn.admin_id !== dto.admin_id) throw new BadRequestException('blesscomn is not found!');

    if (dto.region_id) {
      const region = await this.regionService.getOneById(dto.region_id);
      if (!region) throw new BadRequestException('Region is not found!');
      dto.region = region;
    }

    await this.blesscomnRepository.save({
      ...blesscomn,
      ...dto,
    });

    return id;
  }

  async remove(id: number) {
    const blesscomn = await this.findOne(id);
    if (!blesscomn) throw new BadRequestException('blesscomn is not found!');

    await this.blesscomnRepository.softRemove(blesscomn);

    return id;
  }
}
