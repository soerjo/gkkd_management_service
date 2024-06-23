import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBaptisanDto } from '../dto/create-baptisan.dto';
import { UpdateBaptisanDto } from '../dto/update-baptisan.dto';
import { JemaatService } from '../../jemaat/services/jemaat.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaptismRecordEntity } from '../entities/baptisan.entity';
import { FilterDto } from '../dto/filter.dto';
import { BaptismRepository } from '../repository/baptism.repository';

@Injectable()
export class BaptisanService {
  constructor(
    @InjectRepository(BaptismRecordEntity)
    private baptismRepo: Repository<BaptismRecordEntity>,
    private customBaptismRepo: BaptismRepository,
    private readonly jemaatService: JemaatService,
  ) {}

  async create(dto: CreateBaptisanDto) {
    const jemaat = await this.jemaatService.findOne(dto.nij, dto.region_id);
    if (!jemaat) throw new BadRequestException('jemaat is not found');

    const baptismRecord = this.baptismRepo.create({
      full_name: jemaat.full_name,
      name: jemaat.name,
      jemaat: jemaat,
      jemaat_id: jemaat.id,
      region_id: jemaat.region_id,
      ...dto,
    });
    return await this.baptismRepo.save(baptismRecord);
  }

  findAll(filter: FilterDto) {
    return this.customBaptismRepo.getAll(filter);
  }

  findOne(id: string, region_id: number) {
    return this.baptismRepo.findOne({ where: { uniq_code: id, region_id }, relations: { jemaat: true } });
  }

  async update(id: string, dto: UpdateBaptisanDto) {
    const baptismRecord = await this.findOne(id, dto.region_id);
    if (!baptismRecord) throw new BadRequestException('baptism record is not found');

    await this.baptismRepo.save({
      ...baptismRecord,
      ...dto,
    });

    return baptismRecord.uniq_code;
  }

  async remove(id: string, region_id: number) {
    const baptismRecord = await this.findOne(id, region_id);
    if (!baptismRecord) throw new BadRequestException('baptism record is not found');

    await this.baptismRepo.softRemove(baptismRecord);

    return baptismRecord.uniq_code;
  }
}
