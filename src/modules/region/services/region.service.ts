import { BadRequestException, Injectable } from '@nestjs/common';
import { RegionRepository } from '../repository/region.repository';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { In, IsNull } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class RegionService {
  constructor(private readonly regionRepository: RegionRepository) {}

  async percobaan(name: string) {
    if (typeof name === 'string') return true;
    return false;
  }

  async create(dto: CreateRegionDto) {
    const existRegion = await this.regionRepository.findOne({
      where: { name: dto.name },
      withDeleted: true,
    });
    if (existRegion) throw new BadRequestException('Region already exists!');

    if (dto.parent_id) {
      if (dto.parent_id === existRegion.id) throw new BadRequestException('can not set it self as a parent');
      const parentRegion = await this.regionRepository.findOne({
        where: { id: dto.parent_id },
      });
      console.log({ parentRegion });
      if (!parentRegion) throw new BadRequestException('Prent region not found!');
    }

    const region = this.regionRepository.create(dto);
    return this.regionRepository.save(region);
  }

  getOneById(id: number) {
    return this.regionRepository.findOne({
      where: { id: id ?? IsNull() },
      relations: { parent: true },
      withDeleted: true,
    });
  }

  getManyByIds(ids: number[]) {
    return this.regionRepository.find({
      where: { id: In(ids) },
      withDeleted: true,
    });
  }

  getAll(filter: FilterDto) {
    return this.regionRepository.getAll(filter);
  }

  async update(id: number, dto: UpdateRegionDto) {
    const existRegion = await this.getOneById(id);
    if (!existRegion) throw new BadRequestException('regions is not found');

    if (dto.parent_id === existRegion.id) throw new BadRequestException('can not set it self as a parent');
    const parentRegion = await this.regionRepository.findOne({
      where: { id: dto.parent_id },
    });
    if (!parentRegion) throw new BadRequestException('Prent region not found!');
    if (!dto.parent_id) {
      existRegion.parent_id = null;
      existRegion.parent = null;
    }

    const updateRegion = await this.regionRepository.save({
      ...existRegion,
      ...dto,
    });

    return updateRegion.id;
  }

  async remove(id: number) {
    const region = await this.getOneById(id);
    if (!region) throw new BadRequestException('regions is not found');

    await this.regionRepository.softRemove(region);

    return region.id;
  }

  async restore(id: number) {
    const region = await this.getOneById(id);
    if (!region) throw new BadRequestException('regions is not found');

    await this.regionRepository.recover(region);

    return region.id;
  }
}
