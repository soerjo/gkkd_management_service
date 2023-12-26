import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJemaatDto } from '../dto/create-jemaat.dto';
import { UpdateJemaatDto } from '../dto/update-jemaat.dto';
import { JemaatRepository } from '../repository/jemaat.repository';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class JemaatService {
  constructor(private readonly jemaatRepository: JemaatRepository) {}

  async create(createJemaatDto: CreateJemaatDto) {
    const jemaat = this.jemaatRepository.create(createJemaatDto);
    const newJemaat = await this.jemaatRepository.save(jemaat);
    return newJemaat;
  }

  findAll(filter: FilterDto) {
    return this.jemaatRepository.getAll(filter);
  }

  findOne(id: string) {
    return this.jemaatRepository.findOneBy({ id });
  }

  async update(id: string, updateJemaatDto: UpdateJemaatDto) {
    const jemaat = await this.findOne(id);
    if (!jemaat)
      throw new BadRequestException({ message: 'jemaat is not found!' });

    await this.jemaatRepository.save({
      ...jemaat,
      ...updateJemaatDto,
    });

    return jemaat.id;
  }

  async remove(id: string) {
    const jemaat = await this.findOne(id);
    if (!jemaat)
      throw new BadRequestException({ message: 'jemaat is not found!' });

    await this.jemaatRepository.softRemove(jemaat);

    return jemaat.id;
  }
}
