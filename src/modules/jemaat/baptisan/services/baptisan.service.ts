import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBaptisanDto } from '../dto/create-baptisan.dto';
import { UpdateBaptisanDto } from '../dto/update-baptisan.dto';
import { JemaatService } from '../../jemaat/services/jemaat.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaptismRecordEntity } from '../entities/baptisan.entity';
import { FilterDto } from '../dto/filter.dto';
import { BaptismRepository } from '../repository/baptism.repository';
import { RegionService } from '../../../region/services/region.service';

@Injectable()
export class BaptisanService {
  constructor(
    @InjectRepository(BaptismRecordEntity)
    private baptismRepo: Repository<BaptismRecordEntity>,
    private customBaptismRepo: BaptismRepository,
    private readonly jemaatService: JemaatService,
    private readonly regionService: RegionService,
  ) {}

  async create(dto: CreateBaptisanDto) {
    const jemaat = await this.jemaatService.findOne(dto.nij);
    if (!jemaat) throw new BadRequestException('jemaat is not found');

    const baptismRecord = this.baptismRepo.create({
      full_name: jemaat.full_name,
      name: jemaat.name,
      jemaat: jemaat,
      region_id: jemaat.region_id,
      ...dto,
    });
    return await this.baptismRepo.save(baptismRecord);
  }

  async findAll(filter: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_id });
    filter.region_ids = regions.map((data) => data.id);

    return this.customBaptismRepo.getAll(filter);
  }

  async findOne(uniq_code: string, region_id?: number) {
    return this.baptismRepo.findOne({
      where: { uniq_code: uniq_code, region_id },
      relations: { jemaat: true, region: true },
    });
  }

  async update(uniq_code: string, dto: UpdateBaptisanDto, user_region_id: number) {
    const baptismRecord = await this.findOne(uniq_code);
    if (!baptismRecord) throw new BadRequestException('baptism record is not found');

    const regions = await this.regionService.getByHierarchy({ region_id: user_region_id });
    dto.region_ids = regions.map((data) => data.id);

    const isInParent = baptismRecord.region_id === user_region_id;
    const isInHeiracy = dto.region_ids.includes(baptismRecord.region_id);
    if (!isInParent && !isInHeiracy) throw new ForbiddenException();

    delete baptismRecord.region;

    await this.baptismRepo.save({
      ...baptismRecord,
      ...dto,
    });

    return baptismRecord.uniq_code;
  }

  async remove(uniq_code: string, user_region_id: number) {
    const baptismRecord = await this.findOne(uniq_code);
    if (!baptismRecord) throw new BadRequestException('baptism record is not found');

    let region_ids: number[] = [];
    const regions = await this.regionService.getByHierarchy({ region_id: user_region_id });
    region_ids = regions.map((data) => data.id);

    const isInParent = baptismRecord.region_id === user_region_id;
    const isInHeiracy = region_ids.includes(baptismRecord.region_id);
    if (!isInParent && !isInHeiracy) throw new ForbiddenException();

    await this.baptismRepo.softRemove(baptismRecord);

    return baptismRecord.uniq_code;
  }
}
