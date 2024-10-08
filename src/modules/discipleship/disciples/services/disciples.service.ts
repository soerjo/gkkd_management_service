import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePemuridanDto } from '../dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from '../dto/update-pemuridan.dto';
import { DisciplesRepository } from '../repository/disciples.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from '../../../../modules/region/services/region.service';
import { AdminService } from '../../../admin/services/admin.service';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { Transactional } from 'typeorm-transactional';
import { JemaatService } from '../../../jemaat/jemaat/services/jemaat.service';
import { JemaatEntity } from '../../../jemaat/jemaat/entities/jemaat.entity';
import { DisciplesEntity } from '../entities/disciples.entity';
import { DisciplesGroupService } from '../../disciples-group/services/disciples.service';

@Injectable()
export class DisciplesService {
  constructor(
    private readonly pemuridanRepository: DisciplesRepository,
    private readonly regionService: RegionService,
    private readonly adminService: AdminService,
    private readonly jemaatService: JemaatService,
    private readonly groupService: DisciplesGroupService,
  ) {}

  @Transactional()
  async create(dto: CreatePemuridanDto) {
    if (dto.region_id) {
      const region = await this.regionService.getOneById(dto.region_id);
      if (!region) throw new BadRequestException('Region is not found!');
    }

    if (dto.group_id) {
      const group = await this.groupService.findOne(dto.group_id);
      if (!group) throw new BadRequestException('group is not found!');
      delete dto.group_id;
      dto.group_unique_id = group.unique_id;
    }

    if (dto.jemaat_nij) {
      let jemaat = await this.jemaatService.findOne(dto.jemaat_nij);
      if (!jemaat) throw new BadRequestException('jemaat is not found');

      let muridByNij = await this.pemuridanRepository.findOne({ where: { jemaat_nij: dto.jemaat_nij } });
      if (muridByNij) throw new BadRequestException('jemaat nij already related to murid nim: ' + muridByNij.nim);

      dto.name = jemaat.name;
    }

    let pemuridan = this.pemuridanRepository.create({
      ...dto,
      group_id: dto.group_unique_id,
    });
    pemuridan = await this.pemuridanRepository.save(pemuridan);

    const admin = await this.adminService.create({
      name: pemuridan.name,
      username: pemuridan.nim,
      role: RoleEnum.DISCIPLES,
      region_id: dto.region_id,
    });

    await this.pemuridanRepository.save({
      ...pemuridan,
      admin: admin,
    });
  }

  async getAllList(filter: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_tree_id });
    filter.region_ids = regions.map((data) => data.id);
    filter.region_tree_id && filter.region_ids.push(filter.region_tree_id);

    const disciples = await this.getByHierarchy({ pembimbing_id: filter.disciple_tree_id });
    filter.disciple_ids = disciples.map((data) => data.id);
    // filter.disciple_tree_id && filter.disciple_ids.push(filter.disciple_tree_id);

    if (filter.group_id) {
      const group = await this.groupService.findOne(filter.group_id);
      filter.group_unique_id = group.unique_id;
    }

    return this.pemuridanRepository.getAll(filter);
  }

  async findAll(filter: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_tree_id });
    filter.region_ids = regions.map((data) => data.id);
    filter.region_tree_id && filter.region_ids.push(filter.region_tree_id);

    const disciples = await this.getByHierarchy({ pembimbing_id: filter.disciple_tree_id });
    filter.disciple_ids = disciples.map((data) => data.id);
    if (filter.disciple_tree_id) filter.disciple_ids.push(filter.disciple_tree_id);
    delete filter.pembimbing_id;

    if (filter.group_id) {
      const group = await this.groupService.findOne(filter.group_id);
      filter.group_unique_id = group.unique_id;
    }

    return this.pemuridanRepository.getAll(filter);
  }

  async getAccountDisciple(admin_id: number) {
    return this.pemuridanRepository.findOne({ where: { admin: { id: admin_id } } });
  }

  async getAccountDiscipleByNim(nim: string) {
    return this.pemuridanRepository.findOne({ where: { nim } });
  }

  async findOne(nim: string) {
    return this.pemuridanRepository.getOne(nim);
  }

  async updateGroup(nims: string[], groupId: string) {
    let updateGroupMurid: DisciplesEntity[] = [];
    for (const nim of nims) {
      const murid = await this.findOne(nim);
      if (!murid) throw new BadRequestException('disciples is not found!');
      updateGroupMurid.push(this.pemuridanRepository.create({ ...murid, group_id: groupId }));
    }

    this.pemuridanRepository.save(updateGroupMurid);
  }

  async findOneById(id: number) {
    return this.pemuridanRepository.findOne({ where: { id } });
  }

  async getByHierarchy(filter: FilterDto) {
    return this.pemuridanRepository.getByHirarcy(filter);
  }

  async update(nim: string, dto: UpdatePemuridanDto) {
    const pemuridan = await this.findOne(nim);
    if (!pemuridan) throw new BadRequestException('disciples is not found!');

    const group = await this.groupService.findOne(dto.group_id);

    let parent;
    if (dto.pembimbing_id) {
      parent = await this.findOneById(dto.pembimbing_id);
      if (!parent) throw new BadRequestException('parent is not found!');
      pemuridan.parent = parent;
    }

    if (pemuridan.jemaat_nij) delete dto.name;

    let jemaat: JemaatEntity;
    let muridByNij: DisciplesEntity;
    if (dto.jemaat_nij) {
      jemaat = await this.jemaatService.findOne(dto.jemaat_nij);
      if (!jemaat) throw new BadRequestException('jemaat is not found');
      muridByNij = await this.pemuridanRepository.findOne({ where: { jemaat_nij: dto.jemaat_nij } });
    }

    if (muridByNij && pemuridan.id !== muridByNij.id)
      throw new BadRequestException('jemaat nij already related to murid nim: ' + muridByNij.nim);

    if (jemaat) dto.name = jemaat.name;

    const updateMurid = this.pemuridanRepository.create({
      ...pemuridan,
      ...dto,
      group: group ?? null,
      group_id: group?.unique_id ?? null,
      parent: parent,
    });

    await this.pemuridanRepository.save(updateMurid);

    return nim;
  }

  async remove(nim: string) {
    const pemuridan = await this.findOne(nim);
    if (!pemuridan) throw new BadRequestException('Pemuridan is not found!');

    await this.pemuridanRepository.softRemove(pemuridan);

    return nim;
  }
}
