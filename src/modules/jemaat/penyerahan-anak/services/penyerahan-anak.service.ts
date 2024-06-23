import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePenyerahanAnakDto } from '../dto/create-penyerahan-anak.dto';
import { UpdatePenyerahanAnakDto } from '../dto/update-penyerahan-anak.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PenyerahanAnakEntity } from '../entities/penyerahan-anak-record.entity';
import { Repository } from 'typeorm';
import { JemaatService } from '../../jemaat/services/jemaat.service';
import { PenyerahanAnakRepository } from '../repository/penyerahan-anak.repository';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class PenyerahanAnakService {
  constructor(
    @InjectRepository(PenyerahanAnakEntity)
    private readonly penyerahanRecord: Repository<PenyerahanAnakEntity>,
    private readonly customPenyerahanRecord: PenyerahanAnakRepository,
    private readonly jemaatService: JemaatService,
  ) {}

  async create(dto: CreatePenyerahanAnakDto) {
    const isExist = await this.penyerahanRecord.findOne({ where: { full_name: dto.full_name } });

    const jemaatFather = await this.jemaatService.findOne(dto.nijFather, dto.region_id);
    const jemaatMother = await this.jemaatService.findOne(dto.nijMother, dto.region_id);
    if (!jemaatMother && !jemaatFather) {
      throw new BadRequestException('father or mother data jemaat is not found');
    }

    if (isExist && isExist.father_name === dto.father_name && isExist.mother_name === dto.mother_name) {
      throw new BadRequestException('data is already exist');
    }

    const penyerahanAnak = this.penyerahanRecord.create({
      ...dto,
      father_name: jemaatFather?.full_name ?? dto?.father_name,
      mother_name: jemaatMother?.full_name ?? dto?.mother_name,
    });

    return this.penyerahanRecord.save(penyerahanAnak);
  }

  findAll(filter: FilterDto) {
    return this.customPenyerahanRecord.getAll(filter);
  }

  findOne(unique_code: string, region_id: number) {
    return this.penyerahanRecord.findOne({ where: { unique_code, region_id } });
  }

  async update(unique_code: string, dto: UpdatePenyerahanAnakDto) {
    const recordPenyerahan = await this.findOne(unique_code, dto.region_id);
    if (!recordPenyerahan) throw new BadRequestException('record is not found');

    await this.penyerahanRecord.save({ ...recordPenyerahan, ...dto });
    return recordPenyerahan.unique_code;
  }

  async remove(unique_code: string, region_id: number) {
    const recordPenyerahan = await this.findOne(unique_code, region_id);
    if (!recordPenyerahan) throw new BadRequestException('record is not found');

    await this.penyerahanRecord.softRemove(recordPenyerahan);
    return recordPenyerahan.unique_code;
  }
}
