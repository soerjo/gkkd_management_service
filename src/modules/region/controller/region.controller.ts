import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { RegionService } from '../services/region.service';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { FilterDto } from '../dto/filter.dto';

@ApiTags('Region')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  async findAll(@Query() filter: FilterDto) {
    return {
      message: 'success',
      data: await this.regionService.getAll(filter),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.regionService.getOneById(id);
    if (!result) throw new BadRequestException({ message: 'region is not found!' });

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRegionDto: UpdateRegionDto) {
    return {
      message: 'success',
      data: await this.regionService.update(id, updateRegionDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return {
      message: 'success',
      data: await this.regionService.remove(id),
    };
  }
}
