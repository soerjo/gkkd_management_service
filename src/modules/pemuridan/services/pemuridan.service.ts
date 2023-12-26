import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePemuridanDto } from '../dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from '../dto/update-pemuridan.dto';
import { PemuridanRepository } from '../repository/pemuridan.repository';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class PemuridanService {
  constructor(private readonly pemuridanRepository: PemuridanRepository) {}

  async create(createPemuridanDto: CreatePemuridanDto) {
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
      throw new BadRequestException({ message: 'pemuridan is not found!' });

    const updatePemuridan = await this.pemuridanRepository.save({
      ...pemuridan,
      ...UpdatePemuridanDto,
    });

    return id;
  }

  async remove(id: string) {
    const pemuridan = await this.findOne(id);
    if (!pemuridan)
      throw new BadRequestException({ message: 'pemuridan is not found!' });

    await this.pemuridanRepository.softRemove(pemuridan);

    return id;
  }
}
