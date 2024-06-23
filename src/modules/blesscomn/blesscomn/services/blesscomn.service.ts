import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlesscomnDto } from '../dto/create-blesscomn.dto';
import { UpdateBlesscomnDto } from '../dto/update-blesscomn.dto';
import { BlesscomnRepository } from '../repository/blesscomn.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from 'src/modules/region/services/region.service';
import { JemaatService } from 'src/modules/jemaat/jemaat/services/jemaat.service';
import { IsNull } from 'typeorm';

export interface IPercobaan {
  name: 'soerjo';
  age: 27;
}

@Injectable()
export class BlesscomnService {
  constructor(
    private readonly blesscomnRepository: BlesscomnRepository,
    private readonly regionService: RegionService,
    private readonly jemaatService: JemaatService,
  ) {}

  async coba(data: IPercobaan) {
    if (!(await this.regionService.percobaan(data.name))) throw new BadRequestException('error');
    return { ...data, id: '123' };
  }

  async create(createBlesscomnDto: CreateBlesscomnDto) {
    const region = await this.regionService.getOneById(createBlesscomnDto.region_id);
    if (!region) throw new BadRequestException('Region is not found!');
    createBlesscomnDto.region = region;

    const isBlesscomnNameExist = await this.blesscomnRepository.findOne({
      where: {
        name: createBlesscomnDto.name,
        region: {
          id: createBlesscomnDto.region_id,
        },
      },
    });
    if (isBlesscomnNameExist) throw new BadRequestException(`blesscomn name is already exist in region ${region.name}`);

    // if (createBlesscomnDto.lead_id) {
    //   const lead = await this.jemaatService.findOne(createBlesscomnDto.lead_id);
    //   if (!lead) throw new BadRequestException('Lead is not found in jemaat');
    //   createBlesscomnDto.lead_jemaat = lead;
    // }

    const blesscomn = this.blesscomnRepository.create(createBlesscomnDto);
    return this.blesscomnRepository.save(blesscomn);
  }

  findAll(filter: FilterDto) {
    return this.blesscomnRepository.getAll(filter);
  }

  findOne(id: number) {
    return this.blesscomnRepository.findOne({
      where: { id: id ?? IsNull() },
      relations: { region: true },
      select: {
        id: true,
        name: true,
        location: true,
        // lead: true,
        members: true,
      },
    });
  }

  findOneByLeadId(leadId: number) {
    return this.blesscomnRepository.findOne({ where: { lead: { id: leadId ?? IsNull() } } });
  }

  async update(id: number, updateBlesscomnDto: UpdateBlesscomnDto) {
    const blesscomn = await this.findOne(id);
    if (!blesscomn) throw new BadRequestException('blesscomn is not found!');

    if (updateBlesscomnDto.region_id) {
      const region = await this.regionService.getOneById(updateBlesscomnDto.region_id);
      if (!region) throw new BadRequestException('Region is not found!');
      updateBlesscomnDto.region = region;
    }

    // if (updateBlesscomnDto.lead_id) {
    //   const lead = await this.jemaatService.findOne(updateBlesscomnDto.lead_id);
    //   if (!lead) throw new BadRequestException('Lead is not found in jemaat');
    //   updateBlesscomnDto.lead_jemaat = lead;
    // }

    await this.blesscomnRepository.save({
      ...blesscomn,
      ...updateBlesscomnDto,
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
