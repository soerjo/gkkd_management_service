import { BadRequestException, Injectable } from '@nestjs/common';
import { RegionRepository } from '../repository/region.repository';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { In, IsNull } from 'typeorm';

@Injectable()
export class RegionService {
  constructor(private readonly regionRepository: RegionRepository) {}

  async percobaan(name: string) {
    if (typeof name === 'string') return true;
    return false;
  }

  async create(createRegionDto: CreateRegionDto) {
    const isRegionNameExist = await this.regionRepository.findOneBy({ name: createRegionDto.name });
    if (isRegionNameExist) throw new BadRequestException({ message: 'Region already exists!' });

    const region = this.regionRepository.create(createRegionDto);
    return this.regionRepository.save(region);
  }

  getOneById(id: string) {
    return this.regionRepository.findOneBy({ id: id ?? IsNull() });
  }

  getManyByIds(ids: string[]) {
    return this.regionRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  getAll() {
    return this.regionRepository.find();
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    const region = await this.getOneById(id);
    if (!region) throw new BadRequestException({ message: 'regions is not found' });

    const updateRegion = await this.regionRepository.save({
      ...region,
      ...updateRegionDto,
    });

    return updateRegion.id;
  }

  async remove(id: string) {
    const region = await this.getOneById(id);
    if (!region) throw new BadRequestException({ message: 'regions is not found' });

    await this.regionRepository.softRemove(region);

    return region.id;
  }
}
