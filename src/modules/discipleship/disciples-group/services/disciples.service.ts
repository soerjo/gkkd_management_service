import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { DisciplesGroupRepository } from '../repository/disciples.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from '../../../../modules/region/services/region.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { DisciplesService } from '../../disciples/services/disciples.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class DisciplesGroupService {
  constructor(
    @Inject(forwardRef(() => DisciplesService))
    private readonly pemuridanService: DisciplesService,
    private readonly pemuridanGroupRepository: DisciplesGroupRepository,
    private readonly regionService: RegionService,
  ) {}

  async create(dto: CreateGroupDto) {
    const disciples = await this.pemuridanService.findOne(dto.pembimbing_nim);
    if (!disciples) throw new BadRequestException('disciples is not found');

    const region = await this.regionService.getOneById(dto.region_id);
    if (!region) throw new BadRequestException('region is not found!');

    const create = this.pemuridanGroupRepository.create({
      ...dto,
      pembimbing_nim: dto.pembimbing_nim,
      pembimbing_id: disciples.id,
      pembimbing: disciples,
    });

    return this.pemuridanGroupRepository.save(create);
  }

  async findAll(filter: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_tree_id });
    filter.region_ids = regions.map((data) => data.id);
    filter.region_tree_id && filter.region_ids.push(filter.region_tree_id);

    const disciples = await this.pemuridanService.getByHierarchy({ pembimbing_id: filter.pembimbing_id });
    filter.disciple_nims = disciples.map((data) => data.nim);
    filter.disciple_nims.push(filter.pembimbing_nim);

    return this.pemuridanGroupRepository.getAll(filter);
  }

  async findOne(id: number) {
    return this.pemuridanGroupRepository.getOneById(id);
  }

  async getByPembimbingNim(nim: string) {
    return this.pemuridanGroupRepository.getByPembimbingNim(nim);
  }

  @Transactional()
  async update(id: number, dto: UpdateGroupDto) {
    const group = await this.findOne(id);
    if (!group) throw new BadRequestException('group is not found!');

    const disciples = await this.pemuridanService.findOne(dto.pembimbing_nim);
    if (!disciples) throw new BadRequestException('disciples is not found');
    delete group.pembimbing;
    group.pembimbing_nim = disciples.nim;
    group.pembimbing = disciples;

    const region = await this.regionService.getOneById(dto.region_id);
    if (!region) throw new BadRequestException('region is not found!');

    // await this.pemuridanService.updateGroup(dto.anggota_nims, group.unique_id);

    group.anggota = [];
    for (const anggota_nim of dto.anggota_nims) {
      const disciples = await this.pemuridanService.findOne(anggota_nim);
      if (!disciples) throw new BadRequestException('disciples is not found');
      group.anggota.push(disciples);
    }

    await this.pemuridanGroupRepository.save({ ...group, ...dto });

    return id;
  }

  async remove(id: number) {
    const group = await this.findOne(id);
    if (!group) throw new BadRequestException('group is not found!');

    await this.pemuridanGroupRepository.softRemove(group);

    return id;
  }
}
