import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSundayServiceDto } from '../dto/create-sunday-service.dto';
import { UpdateSundayServiceDto } from '../dto/update-sunday-service.dto';
import { SundayServiceRepository } from '../repository/report-pemuridan.repository';
import { RegionService } from 'src/modules/region/services/region.service';

@Injectable()
export class SundayServiceService {
  constructor(
    private readonly sundayServiceRepository: SundayServiceRepository,
    private readonly regionService: RegionService,
  ) {}

  async create(dto: CreateSundayServiceDto) {
    const IsNameAlreadyExist = await this.sundayServiceRepository.findOne({
      where: { name: dto.name, region: { id: dto.region_id } },
    });

    const region = await this.regionService.getOneById(dto.region_id);
    if (!region) throw new BadRequestException('region is not found!');

    return this.sundayServiceRepository.save({ ...dto, region: region });
  }

  async findAll() {
    return `This action returns all sundayService`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} sundayService`;
  }

  async getOneById(id: string, region_id?: string) {
    return this.sundayServiceRepository.findOne({ where: { id, region: { id: region_id } } });
  }

  async update(id: string, updateSundayServiceDto: UpdateSundayServiceDto) {
    return `This action updates a #${id} sundayService`;
  }

  async remove(id: string) {
    return `This action removes a #${id} sundayService`;
  }
}
