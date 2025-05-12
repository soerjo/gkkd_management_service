import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDatumDto } from '../dto/create-datum.dto';
import { UpdateDatumDto } from '../dto/update-datum.dto';
import { HospitaltityDataRepository } from '../repositories/hospitality-data.repository';
import { SegmentService } from '../../../../modules/segment/services/segment.service';
import { BlesscomnService } from '../../../../modules/blesscomn/blesscomn/services/blesscomn.service';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { ILike } from 'typeorm';
import { FindHospitalityData } from '../dto/find-hospitality-data.dto';

@Injectable()
export class HospitalityDataService {
  constructor(
    private readonly hospitalityDataRepository: HospitaltityDataRepository,
    private readonly segementService: SegmentService,
    private readonly blesscomnService: BlesscomnService,
  ) {}
  
  async create(createDatumDto: CreateDatumDto, jwtPayload: IJwtPayload) {
    const segement = await this.segementService.findOne(createDatumDto.segment_id, jwtPayload);
    if(!segement) throw new BadRequestException('Segment not found');

    const blesscomn = createDatumDto.blesscomn_id ? await this.blesscomnService.findOne(createDatumDto.blesscomn_id) : null;
    if(createDatumDto.blesscomn_id && !blesscomn) throw new BadRequestException('Blesscomn not found');

    const createHospitalityData = this.hospitalityDataRepository.create({
      ...createDatumDto,
      region_id: jwtPayload.region_id,
    });

    return this.hospitalityDataRepository.save(createHospitalityData);
  }

  findAll(dto: FindHospitalityData, jwtPayload: IJwtPayload) {
    return this.hospitalityDataRepository.getAll({...dto, region_id: jwtPayload.region_id});
  }

  findOne(id: number, jwtPayload?: IJwtPayload) {
    return this.hospitalityDataRepository.findOne({where: {id}});
  }

  async update(id: number, updateDatumDto: UpdateDatumDto, jwtPayload: IJwtPayload) {
    const data = await this.hospitalityDataRepository.findOne({where: {id}});
    if(!data) throw new BadRequestException('Data not found');

    const segement = updateDatumDto.segment_id ? await this.segementService.findOne(updateDatumDto.segment_id, jwtPayload) : null;
    if(updateDatumDto.segment_id && !segement) throw new BadRequestException('Segment not found');

    const blesscomn = updateDatumDto.blesscomn_id ? await this.blesscomnService.findOne(updateDatumDto.blesscomn_id) : null;
    if(updateDatumDto.blesscomn_id && !blesscomn) throw new BadRequestException('Blesscomn not found');

    const updateData = this.hospitalityDataRepository.create({
      ...data,
      ...updateDatumDto,
      updated_by: jwtPayload.id,
    })

    return this.hospitalityDataRepository.save(updateData);
  }

  async remove(id: number, jwtPayload: IJwtPayload) {
    const data = await this.hospitalityDataRepository.findOne({where: {id}});
    if(!data) throw new BadRequestException('Data not found');

    return this.hospitalityDataRepository.softDelete(id);
  }
}
