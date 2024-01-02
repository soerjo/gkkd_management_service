import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePemuridanDto } from '../dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from '../dto/update-pemuridan.dto';
import { PemuridanRepository } from '../repository/pemuridan.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from 'src/modules/region/services/region.service';
import { JemaatService } from 'src/modules/jemaat/services/jemaat.service';

@Injectable()
export class PemuridanService {
  constructor(
    private readonly pemuridanRepository: PemuridanRepository,
    private readonly regionService: RegionService,
    private readonly jemaatService: JemaatService,
  ) {}

  async create(createPemuridanDto: CreatePemuridanDto) {
    const region = await this.regionService.getOneById(createPemuridanDto.region_id)
    if(!region) throw new BadRequestException({message: 'Region is not found!'})
    createPemuridanDto.region = region

    const lead = await this.jemaatService.findOne(createPemuridanDto.lead_id)
    if(!lead) throw new BadRequestException({message: 'Lead is not found in Jemaat!'})
    createPemuridanDto.lead = lead
    
    const pemuridan = this.pemuridanRepository.create(createPemuridanDto);
    return this.pemuridanRepository.save(pemuridan);
  }

  async findAll(filter: FilterDto) {
    return this.pemuridanRepository.getAll(filter);
  }

  async findOne(id: string) {
    return this.pemuridanRepository.findOneBy({ id });
  }

  async update(id: string, updatePemuridanDto: UpdatePemuridanDto) {
    const pemuridan = await this.findOne(id);
    if (!pemuridan)
      throw new BadRequestException({ message: 'Pemuridan is not found!' });

    if(updatePemuridanDto.region_id){
      const region = await this.regionService.getOneById(updatePemuridanDto.region_id)
      if(!region) throw new BadRequestException({message: 'Region is not found!'})
      updatePemuridanDto.region = region
    }

    if(updatePemuridanDto.lead_id){
      const lead = await this.jemaatService.findOne(updatePemuridanDto.lead_id)
      if(!lead) throw new BadRequestException({message: 'Lead is not found in Jemaat!'})
      updatePemuridanDto.lead = lead
    }

      await this.pemuridanRepository.save({
      ...pemuridan,
      ...UpdatePemuridanDto,
    });

    return id;
  }

  async remove(id: string) {
    const pemuridan = await this.findOne(id);
    if (!pemuridan)
      throw new BadRequestException({ message: 'Pemuridan is not found!' });

    await this.pemuridanRepository.softRemove(pemuridan);

    return id;
  }
}
