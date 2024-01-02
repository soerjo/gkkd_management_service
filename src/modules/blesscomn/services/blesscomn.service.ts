import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlesscomnDto } from '../dto/create-blesscomn.dto';
import { UpdateBlesscomnDto } from '../dto/update-blesscomn.dto';
import { BlesscomnRepository } from '../repository/blesscomn.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from 'src/modules/region/services/region.service';

@Injectable()
export class BlesscomnService {
  constructor(
    private readonly blesscomnRepository: BlesscomnRepository,
    private readonly regionService: RegionService,
    ) {}

    async create(createBlesscomnDto: CreateBlesscomnDto) {
    const region = await this.regionService.getOneById(createBlesscomnDto.region_id)
    if(!region) throw new BadRequestException({message: 'Region is not found!'})

    createBlesscomnDto.region = region
    const blesscomn = this.blesscomnRepository.create(createBlesscomnDto);
    return this.blesscomnRepository.save(blesscomn);
  }

  findAll(filter: FilterDto) {
    return this.blesscomnRepository.getAll(filter);
  }

  findOne(id: string) {
    return this.blesscomnRepository.findOneBy({ id });
  }

  async update(id: string, updateBlesscomnDto: UpdateBlesscomnDto) {
    const blesscomn = await this.findOne(id);
    if (!blesscomn) throw new BadRequestException({ message: 'blesscomn is not found!' });

    const region = await this.regionService.getOneById(updateBlesscomnDto.region_id)
    if(!region) throw new BadRequestException({message: 'Region is not found!'})

    updateBlesscomnDto.region = region

    await this.blesscomnRepository.save({
      ...blesscomn,
      ...updateBlesscomnDto,
    });

    return id;
  }

  async remove(id: string) {
    const blesscomn = await this.findOne(id);
    if (!blesscomn) throw new BadRequestException({ message: 'blesscomn is not found!' });

    await this.blesscomnRepository.softRemove(blesscomn);

    return id;
  }
}
