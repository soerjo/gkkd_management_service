import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJemaatDto } from '../dto/create-jemaat.dto';
import { UpdateJemaatDto } from '../dto/update-jemaat.dto';
import { JemaatRepository } from '../repository/jemaat.repository';
import { FilterDto } from '../dto/filter.dto';
import { In, IsNull } from 'typeorm';
import { RegionService } from 'src/modules/region/services/region.service';

@Injectable()
export class JemaatService {
  constructor(
    private readonly jemaatRepository: JemaatRepository,
    private readonly regionService: RegionService,
  ) {}

  async create(createJemaatDto: CreateJemaatDto) {
    const isJemaatExist = await this.jemaatRepository.findOne({
      where: [{ full_name: createJemaatDto.full_name, region_id: createJemaatDto.region_id }],
    });
    if (isJemaatExist) throw new BadRequestException('Jemaat already exist');

    const region = await this.regionService.getOneById(createJemaatDto.region_id);
    if (!region) throw new BadRequestException('Region is not found!');

    const jemaat = this.jemaatRepository.create(createJemaatDto);

    return this.jemaatRepository.save(jemaat);
  }

  findAll(filter: FilterDto) {
    return this.jemaatRepository.getAll(filter);
  }

  findManyOfId(nijs: string[]) {
    return this.jemaatRepository.find({
      where: {
        nij: In(nijs),
      },
    });
  }

  findOne(nij: string, region_id: number) {
    return this.jemaatRepository.findOne({
      where: { nij: nij ?? IsNull(), region_id: region_id },
      relations: { region: true },
    });
  }

  async update(nij: string, updateJemaatDto: UpdateJemaatDto) {
    const jemaat = await this.findOne(nij, updateJemaatDto.region_id);
    if (!jemaat) throw new BadRequestException('jemaat is not found!');

    const region = await this.regionService.getOneById(updateJemaatDto.region_id);
    if (!region) throw new BadRequestException('Region is not found!');

    await this.jemaatRepository.save({
      ...jemaat,
      ...updateJemaatDto,
    });

    return jemaat.nij;
  }

  async remove(nij: string, region_id?: number) {
    const jemaat = await this.findOne(nij, region_id);
    if (!jemaat) throw new BadRequestException('jemaat is not found!');

    await this.jemaatRepository.softRemove(jemaat);

    return jemaat.nij;
  }
}
