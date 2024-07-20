import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlesscomnDto } from '../dto/create-blesscomn.dto';
import { UpdateBlesscomnDto } from '../dto/update-blesscomn.dto';
import { BlesscomnRepository } from '../repository/blesscomn.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from '../../../../modules/region/services/region.service';
import { JemaatService } from '../../../../modules/jemaat/jemaat/services/jemaat.service';
import { IsNull } from 'typeorm';

@Injectable()
export class BlesscomnService {
  constructor(
    private readonly blesscomnRepository: BlesscomnRepository,
    private readonly regionService: RegionService,
    private readonly jemaatService: JemaatService,
  ) {}

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

  async findOne(id: number) {
    const data = await this.blesscomnRepository.getOne(id);
    if (!data) return;

    return {
      ...data,
      members: data?.members?.split(','),
    };
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
