import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePemuridanDto } from '../dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from '../dto/update-pemuridan.dto';
import { DisciplesGroupRepository } from '../repository/disciples.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from 'src/modules/region/services/region.service';
import { JemaatService } from 'src/modules/jemaat/jemaat/services/jemaat.service';
import { IsNull } from 'typeorm';

@Injectable()
export class DisciplesGroupService {
  constructor(
    private readonly pemuridanRepository: DisciplesGroupRepository,
    private readonly regionService: RegionService,
    // private readonly jemaatService: JemaatService,
  ) {}

  async create(createPemuridanDto: CreatePemuridanDto) {
    if (createPemuridanDto.region_id) {
      const region = await this.regionService.getOneById(createPemuridanDto.region_id);
      if (!region) throw new BadRequestException('Region is not found!');
      createPemuridanDto.region = region;
    }

    // const lead = await this.jemaatService.findOne(createPemuridanDto.lead_id);
    // if (!lead) throw new BadRequestException('Lead is not found in Jemaat!');
    // createPemuridanDto.lead = lead;

    if (!createPemuridanDto.name) {
      const getAllGruop = await this.pemuridanRepository.find({
        where: {
          // lead: {
          //   id: createPemuridanDto.lead_id ?? IsNull(),
          // },
        },
        withDeleted: true,
      });

      const groupLength = getAllGruop.length;
      // createPemuridanDto.name = `${lead.name} - ${groupLength < 10 ? '0' + groupLength : groupLength.toString()}`;
    }

    const pemuridan = this.pemuridanRepository.create(createPemuridanDto);
    return this.pemuridanRepository.save(pemuridan);
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

    // if (updatePemuridanDto.lead_id) {
    //   const lead = await this.jemaatService.findOne(updatePemuridanDto.lead_id);
    //   if (!lead) throw new BadRequestException('Lead is not found in Jemaat!');
    //   updatePemuridanDto.lead = lead;
    // }

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
