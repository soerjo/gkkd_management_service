import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SegmentService } from '../services/segment.service';
import { CreateSegmentDto } from '../dto/create-segment.dto';
import { UpdateSegmentDto } from '../dto/update-segment.dto';
import { FindSegmentDto } from '../dto/find-segment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { CurrentUser } from '../../../common/decorator/jwt-payload.decorator';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';

@ApiTags('Segment')
@Controller('segment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SegmentController {
  constructor(private readonly segmentService: SegmentService) {}

  @Post()
  create(@CurrentUser() jwtPayload: IJwtPayload, @Body() createSegmentDto: CreateSegmentDto) {
    return this.segmentService.create(createSegmentDto, jwtPayload);
  }

  @Get()
  findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() dto: FindSegmentDto) {
    console.log('findAll', dto);
    return this.segmentService.findAll(dto, jwtPayload);
  }

  @Get(':id')
  findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    return this.segmentService.findOne(+id, jwtPayload);
  }

  @Patch(':id')
  update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string, @Body() updateSegmentDto: UpdateSegmentDto) {
    return this.segmentService.update(+id, updateSegmentDto, jwtPayload);
  }

  @Delete(':id')
  remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    return this.segmentService.remove(+id, jwtPayload);
  }
}
