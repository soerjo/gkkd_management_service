import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSegmentDto } from '../dto/create-segment.dto';
import { UpdateSegmentDto } from '../dto/update-segment.dto';
import { SegmentRepository } from '../repositories/segment.repository';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { ILike } from 'typeorm';

@Injectable()
export class SegmentService {
  constructor(private readonly segmentRepository: SegmentRepository) {}

  create(createSegmentDto: CreateSegmentDto, jwtPayload: IJwtPayload) {
    const createSegment = this.segmentRepository.create({
      ...createSegmentDto,
      created_by: jwtPayload.id,
      region_id: jwtPayload.region.id,
    });
    return this.segmentRepository.save(createSegment);
  }

  findAll(dto: any, jwtPayload: IJwtPayload) {
    return this.segmentRepository.find({
      where: {
        ...dto.name && { name: ILike(`%${dto.name}%`) },
        region_id: jwtPayload.region.id, 
      },
      take: 10
    });
  }

  findOne(id: number, jwtPayload: IJwtPayload) {
    return this.segmentRepository.findOne({where: { 
      id: id,         
      region_id: jwtPayload.region.id, 
    }});
  }

  update(id: number, updateSegmentDto: UpdateSegmentDto, jwtPayload: IJwtPayload) {
    const segment = this.segmentRepository.findOne({where: { 
      id: id,         
      region_id: jwtPayload.region.id, 
    }});
    if (!segment) throw new BadRequestException('Segment not found');

    return this.segmentRepository.save({
      ...segment,
      ...updateSegmentDto,
      created_by: jwtPayload.id,
      region_id: jwtPayload.region.id,
    });
  }

  remove(id: number, jwtPayload: IJwtPayload) {
    const segment = this.segmentRepository.findOne({where: { 
      id: id,         
      region_id: jwtPayload.region.id, 
    }});
    if (!segment) throw new BadRequestException('Segment not found');

    return this.segmentRepository.softDelete(id);
  }
}
