import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMaritalDto } from '../dto/create-marital.dto';
import { UpdateMaritalDto } from '../dto/update-marital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaritalRepository } from '../repository/marital.repository';
import { MaritalRecordEntity } from '../entities/marital-record.entity';
import { JemaatService } from '../../jemaat/services/jemaat.service';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from '../../../../modules/region/services/region.service';

@Injectable()
export class MaritalService {
  constructor(
    @InjectRepository(MaritalRecordEntity)
    private maritalRepo: Repository<MaritalRecordEntity>,
    private customMaritalRepo: MaritalRepository,
    private readonly jemaatService: JemaatService,
    private readonly regionService: RegionService,
  ) {}

  async create(dto: CreateMaritalDto) {
    const jemaatHusban = await this.jemaatService.findOne(dto.nijHusban);
    const jemaatWife = await this.jemaatService.findOne(dto.nijWife);
    if (!jemaatHusban && !jemaatWife) throw new BadRequestException('husban or wife data jemaat is not found');

    const baptismRecord = this.maritalRepo.create({
      husband_name: jemaatHusban?.full_name ?? dto.husband_name,
      husband_nik: jemaatHusban?.nik ?? dto.nikHusban,
      husband_nij: jemaatHusban?.nij,
      wife_name: jemaatWife?.full_name ?? dto.wife_name,
      wife_nik: jemaatWife?.nik ?? dto.nikWife,
      wife_nij: jemaatWife?.nij,
      ...dto,
    });
    return await this.maritalRepo.save(baptismRecord);
  }

  async findAll(filter: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_tree_id });
    filter.region_ids = regions.map((data) => data.id);
    filter.region_ids.push(filter.region_tree_id);
    
    return this.customMaritalRepo.getAll(filter);
  }

  findOne(unique_code: string, region_id?: number) {
    return this.maritalRepo.findOne({ where: { unique_code, region_id } });
  }

  async update(unique_code: string, dto: UpdateMaritalDto) {
    const maritalRecord = await this.findOne(unique_code);
    if (!maritalRecord) throw new BadRequestException('marital record is not found');

    const jemaatHusban = await this.jemaatService.findOne(dto.nijHusban);
    const jemaatWife = await this.jemaatService.findOne(dto.nijWife);
    if (!jemaatHusban && !jemaatWife) throw new BadRequestException('husban or wife data jemaat is not found');

    await this.maritalRepo.save({ ...maritalRecord, ...dto });
    return maritalRecord.id;
  }

  async remove(unique_code: string) {
    const maritalRecord = await this.findOne(unique_code);
    if (!maritalRecord) throw new BadRequestException('marital record is not found');

    await this.maritalRepo.softRemove(maritalRecord);
    return maritalRecord.id;
  }
}
