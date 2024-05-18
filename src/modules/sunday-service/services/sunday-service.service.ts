import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSundayServiceDto } from '../dto/create-sunday-service.dto';
import { UpdateSundayServiceDto } from '../dto/update-sunday-service.dto';
import { SundayServiceRepository } from '../repository/report-pemuridan.repository';
import { RegionService } from 'src/modules/region/services/region.service';
import { FilterDto } from '../dto/filter.dto';
import { SundayServiceEntity } from '../entities/sunday-service.entity';

@Injectable()
export class SundayServiceService {
  constructor(
    private readonly sundayServiceRepository: SundayServiceRepository,
    private readonly regionService: RegionService,
  ) {}

  async create(dto: CreateSundayServiceDto) {
    const isNameAlreadyExist = await this.findByName(dto.name, { region_id: dto.region_id });
    if (isNameAlreadyExist) throw new BadRequestException('sunday service name is not found!');

    const region = await this.regionService.getOneById(dto.region_id);
    if (!region) throw new BadRequestException('region is not found!');

    return this.sundayServiceRepository.save({ ...dto, region: region });
  }

  async findAll(filter?: FilterDto) {
    return this.sundayServiceRepository.getAll(filter);
  }

  findByName(name: string, filter: Partial<{ region_id: string }>): Promise<SundayServiceEntity> {
    return this.sundayServiceRepository.findOne({ where: { name, region: { id: filter.region_id } } });
  }

  async findOne(id: string, filter?: FilterDto) {
    return this.sundayServiceRepository.findOne({ where: { id, region: { id: filter.region_id } } });
  }

  async getOneById(id: string, region_id?: string) {
    return this.sundayServiceRepository.findOne({ where: { id, region: { id: region_id } } });
  }

  async update(id: string, dto: UpdateSundayServiceDto) {
    const sundayService = await this.findOne(id);
    if (!sundayService) throw new BadRequestException('sundayService is not found!');

    const isNameAlreadyExist = await this.findByName(dto.name, { region_id: dto.region_id });
    if (isNameAlreadyExist && isNameAlreadyExist.id !== sundayService.id)
      throw new BadRequestException('sunday service name is already exist!');

    const region = await this.regionService.getOneById(dto.region_id);
    if (!region) throw new BadRequestException('region is not found!');

    return this.sundayServiceRepository.save({ ...dto, region: region });
  }

  async remove(id: string) {
    const sundayService = await this.findOne(id);
    if (!sundayService) throw new BadRequestException('sundayService is not found!');

    return this.sundayServiceRepository.softDelete(id);
  }
}
