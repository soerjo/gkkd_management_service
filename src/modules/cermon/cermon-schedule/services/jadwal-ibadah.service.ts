import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJadwalIbadahDto } from '../dto/create-jadwal-ibadah.dto';
import { UpdateJadwalIbadahDto } from '../dto/update-jadwal-ibadah.dto';
import { FilterJadwalIbadahDto } from '../dto/filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CermonScheduleEntity } from '../entities/cermon-schedule.entity';
import { CermonScheduleRepository } from '../repository/cermon-schedule.repository';

@Injectable()
export class JadwalIbadahService {
  constructor(
    @InjectRepository(CermonScheduleEntity)
    private readonly jadwalRepository: Repository<CermonScheduleEntity>,
    private readonly customCermonRepo: CermonScheduleRepository,
  ) {}

  async create(dto: CreateJadwalIbadahDto) {
    const isExist = await this.findByName(dto.name, dto.region_id);
    if (isExist) throw new BadRequestException('cermon already exist');

    this.jadwalRepository.save({
      ...dto,
      name: dto.name,
      time: dto.time,
      description: dto?.description,
      segement: dto.segement,
    });
  }

  findByName(name: string, region_id: number) {
    return this.jadwalRepository.findOne({ where: { name, region_id } });
  }

  findAll(dto: FilterJadwalIbadahDto) {
    return this.customCermonRepo.getAll(dto);
  }

  findOne(id: number, region_id: number) {
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
