import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMaritalDto } from '../dto/create-marital.dto';
import { UpdateMaritalDto } from '../dto/update-marital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaritalRepository } from '../repository/marital.repository';
import { MaritalRecordEntity } from '../entities/marital-record.entity';
import { JemaatService } from '../../jemaat/services/jemaat.service';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class MaritalService {
  constructor(
    @InjectRepository(MaritalRecordEntity)
    private maritalRepo: Repository<MaritalRecordEntity>,
    private customMaritalRepo: MaritalRepository,
    private readonly jemaatService: JemaatService,
  ) {}

  async create(dto: CreateMaritalDto) {
    const jemaatHusban = await this.jemaatService.findOne(dto.nijHusban, dto.region_id);
    const jemaatWife = await this.jemaatService.findOne(dto.nijWife, dto.region_id);
    if (!jemaatHusban && !jemaatWife) throw new BadRequestException('husban or wife data jemaat is not found');

    const baptismRecord = this.maritalRepo.create({
      husband_name: jemaatHusban.full_name,
      husban: jemaatHusban,
      wife_name: jemaatWife.full_name,
      wife: jemaatWife,
      ...dto,
    });
    return await this.maritalRepo.save(baptismRecord);
  }

  findAll(filter: FilterDto) {
    return this.customMaritalRepo.getAll(filter);
  }

  findOne(unique_code: string, region_id: number) {
    return this.maritalRepo.findOne({ where: { unique_code, region_id } });
  }

  async update(unique_code: string, dto: UpdateMaritalDto) {
    const maritalRecord = await this.findOne(unique_code, dto.region_id);
    if (!maritalRecord) throw new BadRequestException('marital record is not found');

    await this.maritalRepo.save({ ...dto });
    return maritalRecord.id;
  }

  async remove(unique_code: string, region_id: number) {
    const maritalRecord = await this.findOne(unique_code, region_id);
    if (!maritalRecord) throw new BadRequestException('marital record is not found');

    await this.maritalRepo.softRemove(maritalRecord);
    return maritalRecord.id;
  }
}
