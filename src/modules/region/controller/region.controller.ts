import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RegionService } from '../services/region.service';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';

@ApiTags('Region')
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  async create(@Body() createRegionDto: CreateRegionDto) {
    return {
      message: 'success',
      data: await this.regionService.create(createRegionDto),
    };
  }

  @Get()
  async findAll() {
    return {
      message: 'success',
      data: await this.regionService.getAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') @UUIDParam() id: string) {
    return {
      message: 'success',
      data: await this.regionService.getOneById(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') @UUIDParam() id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ) {
    return {
      message: 'success',
      data: await this.regionService.update(id, updateRegionDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') @UUIDParam() id: string) {
    return {
      message: 'success',
      data: await this.regionService.remove(id),
    };
  }
}
