import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJadwalIbadahDto } from '../dto/create-jadwal-ibadah.dto';
import { UpdateJadwalIbadahDto } from '../dto/update-jadwal-ibadah.dto';
import { FilterJadwalIbadahDto } from '../dto/filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CermonScheduleEntity } from '../entities/cermon-schedule.entity';
import { CermonScheduleRepository } from '../repository/cermon-schedule.repository';
import { RegionService } from '../../../region/services/region.service';

@Injectable()
export class JadwalIbadahService {
  constructor(
    @InjectRepository(CermonScheduleEntity)
    private readonly jadwalRepository: Repository<CermonScheduleEntity>,
    private readonly customCermonRepo: CermonScheduleRepository,
    private readonly regionService: RegionService,
  ) {}

  async create(dto: CreateJadwalIbadahDto) {
    const isExist = await this.findByName(dto.name, dto.region_id);
    if (isExist) throw new BadRequestException('cermon already exist');

    this.jadwalRepository.save(dto);
  }

  findByName(name: string, region_id: number) {
    return this.jadwalRepository.findOne({ where: { name, region_id } });
  }

  async findAll(dto: FilterJadwalIbadahDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: dto?.region_tree_id });
    dto.region_ids = regions.map((data) => data.id);
    dto.region_ids.push(dto.region_tree_id);

    return this.customCermonRepo.getAll(dto);
  }

  findOne(id: number, region_id?: number) {
    return this.customCermonRepo.getOne(id, region_id);
  }

  async update(id: number, dto: UpdateJadwalIbadahDto) {
    const cermon = await this.findOne(id, dto.region_id);
    if (!cermon) throw new BadRequestException('cermon is not found');

    this.jadwalRepository.save({ ...cermon, ...dto });
  }

  async remove(id: number, region_id: number) {
    const cermon = await this.findOne(id, region_id);
    if (!cermon) throw new BadRequestException('cermon is not found');

    this.jadwalRepository.softRemove(cermon);
  }
}
