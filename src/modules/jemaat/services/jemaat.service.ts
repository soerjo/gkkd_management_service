import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJemaatDto } from '../dto/create-jemaat.dto';
import { UpdateJemaatDto } from '../dto/update-jemaat.dto';
import { JemaatRepository } from '../repository/jemaat.repository';
import { FilterDto } from '../dto/filter.dto';
import { In } from 'typeorm';
import { RegionService } from 'src/modules/region/services/region.service';

@Injectable()
export class JemaatService {
  constructor(
    private readonly jemaatRepository: JemaatRepository,
    private readonly regionService: RegionService,
  ) {}

  async create(createJemaatDto: CreateJemaatDto) {
    const isJemaatExist = await this.jemaatRepository.findOne({
      where:[
        {name: createJemaatDto.name},
        {full_name: createJemaatDto.full_name},
      ]
    })
    if(isJemaatExist) throw new BadRequestException({message: 'Jemaat already exist'})

    const region = await this.regionService.getOneById(createJemaatDto.region_id)
    if(!region) throw new BadRequestException({ message: 'Region is not found!'})

    createJemaatDto.region = region
    createJemaatDto.region_service = region.name
    const jemaat = this.jemaatRepository.create(createJemaatDto);

    return this.jemaatRepository.save(jemaat);
  }

  findAll(filter: FilterDto) {
    return this.jemaatRepository.getAll(filter);
  }

  findManyOfId(ids: string[]) {
    return this.jemaatRepository.find({
      where:{
        id: In(ids)
      }
    })
  }

  findOne(id: string) {
    return this.jemaatRepository.findOneBy({ id });
  }

  async update(id: string, updateJemaatDto: UpdateJemaatDto) {
    const jemaat = await this.findOne(id);
    if (!jemaat) throw new BadRequestException({ message: 'jemaat is not found!' });

    if(updateJemaatDto.region_id){
      const region = await this.regionService.getOneById(updateJemaatDto.region_id)
      if(!region) throw new BadRequestException({ message: 'Region is not found!'})
      updateJemaatDto.region = region
    }

    await this.jemaatRepository.save({
      ...jemaat,
      ...updateJemaatDto,
    });

    return jemaat.id;
  }

  async remove(id: string) {
    const jemaat = await this.findOne(id);
    if (!jemaat) throw new BadRequestException({ message: 'jemaat is not found!' });

    await this.jemaatRepository.softRemove(jemaat);

    return jemaat.id;
  }
}
