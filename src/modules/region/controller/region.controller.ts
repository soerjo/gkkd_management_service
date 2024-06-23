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
import { RolesGuard } from 'src/common/guard/role.guard';
import { RoleEnum } from 'src/common/constant/role.constant';
import { Roles } from 'src/common/decorator/role.decorator';

@ApiTags('Region')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN])
  @Post()
  async create(@Body() createRegionDto: CreateRegionDto) {
    return await this.regionService.create(createRegionDto);
  }

  @Get()
  async findAll(@Query() filter: FilterDto) {
    return await this.regionService.getAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.regionService.getOneById(id);
    if (!result) throw new BadRequestException('region is not found!');
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN])
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRegionDto: UpdateRegionDto) {
    return await this.regionService.update(id, updateRegionDto);
  }

  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN])
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.regionService.remove(id);
  }
}
