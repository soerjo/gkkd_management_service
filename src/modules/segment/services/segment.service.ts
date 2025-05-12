import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSegmentDto } from '../dto/create-segment.dto';
import { UpdateSegmentDto } from '../dto/update-segment.dto';
import { SegmentRepository } from '../repositories/segment.repository';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { ILike } from 'typeorm';

@Injectable()
export class SegmentService {
  constructor(private readonly segmentRepository: SegmentRepository) {}

  async create(createSegmentDto: CreateSegmentDto, jwtPayload: IJwtPayload) {
    const existingSegment = await this.segmentRepository.findOne({
      where: {
        name: createSegmentDto.name,
        region_id: jwtPayload.region.id,
      },
    });
    if (existingSegment) throw new BadRequestException('Segment already exists');

    const createSegment = this.segmentRepository.create({
      ...createSegmentDto,
      created_by: jwtPayload.id,
      region_id: jwtPayload.region.id,
    });
    return this.segmentRepository.save(createSegment);
  }

  findAll(dto: any, jwtPayload: IJwtPayload) {
    return this.segmentRepository.find({
      select: {
        "id": true,
        "name": true,
        "alias": true,
        "description": true,
      },
      where: {
        ...(dto.name ? { name: ILike(`%${dto.name}%`) } : {}),
        region_id: jwtPayload.region.id, 
      },
      order: {
        id: 'ASC',
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

  async update(id: number, updateSegmentDto: UpdateSegmentDto, jwtPayload: IJwtPayload) {
    const segment = await this.segmentRepository.findOne({where: { 
      id: id,         
      region_id: jwtPayload.region.id, 
    }});
    if (!segment) throw new BadRequestException('Segment not found');

    if(updateSegmentDto.name) {
      const existingSegment = await this.segmentRepository.findOne({
        where: {
          name: updateSegmentDto.name,
          region_id: jwtPayload.region.id,
        },
      });
      if (existingSegment && existingSegment.id != id) 
        throw new BadRequestException('Segment already exists');
    }

    return this.segmentRepository.save({
      ...segment,
      ...updateSegmentDto,
      updated_by: jwtPayload.id,
      region_id: jwtPayload.region.id,
    });
  }

  async remove(id: number, jwtPayload: IJwtPayload) {
    const segment = await this.segmentRepository.findOne({where: { 
      id: id,         
      region_id: jwtPayload.region.id, 
    }});
    if (!segment) throw new BadRequestException('Segment not found');

    return this.segmentRepository.remove(segment);
  }
}
