import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { RegionRepository } from '../repository/region.repository';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { In, IsNull } from 'typeorm';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class RegionService {
  constructor(private readonly regionRepository: RegionRepository) {}

  async create(dto: CreateRegionDto) {
    const existRegion = await this.regionRepository.findOne({
      where: { name: dto.name },
      withDeleted: true,
    });
    if (existRegion) throw new BadRequestException('Region already exists!');

    if (dto.parent_id) {
      const parentRegion = await this.regionRepository.findOne({
        where: { id: dto.parent_id },
      });

      if (!parentRegion) throw new BadRequestException('Parent region not found!');
    }

    const region = this.regionRepository.create({
      ...dto,
      name: dto.name.toUpperCase(),
    });

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

  async getAll(filter: FilterDto) {
    const regions = await this.getByHierarchy({ region_id: filter?.region_tree_id });
    filter.region_ids = regions.map((data) => data.id);
    filter.region_ids.push(filter.region_tree_id);
    return this.regionRepository.getList(filter);
  }

  async getTable(filter: FilterDto) {
    const regions = await this.getByHierarchy({ region_id: filter?.region_tree_id });
    filter.region_ids = regions.map((data) => data.id);
    // filter.region_ids.push(filter.region_tree_id);

    return this.regionRepository.getAll(filter);
  }

  async getByHierarchy(filter: FilterDto) {
    const entities = await this.regionRepository.getByHirarcy(filter);
    return entities;
  }

  async update(id: number, dto: UpdateRegionDto) {
    const existRegion = await this.getOneById(id);
    if (!existRegion) throw new BadRequestException('regions is not found');
    existRegion.parent = null;

    if (dto.parent_id === existRegion.id) {
      throw new ForbiddenException();
    }

    const regions = await this.getByHierarchy({ region_id: dto.region_id });
    dto.region_ids = regions.map((data) => data.id);

    const isInHeiracy = dto.region_ids.includes(existRegion.id);
    if (!isInHeiracy) throw new ForbiddenException();

    const existName = await this.regionRepository.findOne({
      where: { name: dto.name },
      withDeleted: true,
    });

    if (existName && existRegion.id !== existName.id) {
      throw new BadRequestException('name already exist');
    }

    const parentRegion = await this.regionRepository.findOne({ where: { id: dto.parent_id } });
    if (dto.parent_id && !parentRegion) {
      throw new BadRequestException('region is not found!');
    }

    if (!dto.parent_id) {
      existRegion.parent_id = null;
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
