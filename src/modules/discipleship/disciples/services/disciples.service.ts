import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePemuridanDto } from '../dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from '../dto/update-pemuridan.dto';
import { DisciplesRepository } from '../repository/disciples.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from '../../../../modules/region/services/region.service';
import { AdminService } from '../../../admin/services/admin.service';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class DisciplesService {
  constructor(
    private readonly pemuridanRepository: DisciplesRepository,
    private readonly regionService: RegionService,
    private readonly adminService: AdminService,
    // private readonly jemaatService: JemaatService,
  ) {}

  @Transactional()
  async create(dto: CreatePemuridanDto) {
    if (dto.region_id) {
      const region = await this.regionService.getOneById(dto.region_id);
      if (!region) throw new BadRequestException('Region is not found!');
      dto.region = region;
    }

    const admin = await this.adminService.create({
      name: dto.name,
      role: RoleEnum.DISCIPLES,
    });
    const pemuridan = this.pemuridanRepository.create({
      ...dto,
      admin: admin,
    });

    await this.pemuridanRepository.save(pemuridan);
  }

  async findAll(filter: FilterDto) {
    return this.pemuridanRepository.getAll(filter);
  }

  async findOne(id: number) {
    return this.pemuridanRepository.findOneBy({ id });
  }

  async update(id: number, updatePemuridanDto: UpdatePemuridanDto) {
    const pemuridan = await this.findOne(id);
    if (!pemuridan) throw new BadRequestException('Pemuridan is not found!');

    if (updatePemuridanDto.region_id) {
      const region = await this.regionService.getOneById(updatePemuridanDto.region_id);
      if (!region) throw new BadRequestException('Region is not found!');
      updatePemuridanDto.region = region;
    }

    await this.pemuridanRepository.save({
      ...pemuridan,
      ...UpdatePemuridanDto,
    });

    return id;
  }

  async remove(id: number) {
    const pemuridan = await this.findOne(id);
    if (!pemuridan) throw new BadRequestException('Pemuridan is not found!');

    await this.pemuridanRepository.softRemove(pemuridan);

    return id;
  }
}
