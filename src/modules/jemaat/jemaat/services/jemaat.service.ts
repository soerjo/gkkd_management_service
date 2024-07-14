import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateJemaatDto } from '../dto/create-jemaat.dto';
import { UpdateJemaatDto } from '../dto/update-jemaat.dto';
import { JemaatRepository } from '../repository/jemaat.repository';
import { FilterDto } from '../dto/filter.dto';
import { In, IsNull } from 'typeorm';
import { RegionService } from '../../../../modules/region/services/region.service';

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

  async findAll(filter: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_id });
    filter.region_ids = regions.map((data) => data.id);

    return this.jemaatRepository.getAll(filter);
  }

  findManyOfId(nijs: string[]) {
    return this.jemaatRepository.find({
      where: {
        nij: In(nijs),
      },
    });
  }

  findOne(nij: string, region_id?: number) {
    return this.jemaatRepository.findOne({
      where: { nij: nij ?? IsNull(), region_id: region_id },
      relations: { region: true },
    });
  }

  async update(nij: string, dto: UpdateJemaatDto, user_region_id: number) {
    const jemaat = await this.findOne(nij);
    if (!jemaat) throw new BadRequestException('jemaat is not found!');

    const regions = await this.regionService.getByHierarchy({ region_id: user_region_id });
    dto.region_ids = regions.map((data) => data.id);

    const isInParent = jemaat.region_id === user_region_id;
    const isInHeiracy = dto.region_ids.includes(jemaat.region_id);
    if (!isInParent && !isInHeiracy) throw new ForbiddenException();

    delete jemaat.region;
    await this.jemaatRepository.save({
      ...jemaat,
      ...dto,
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
