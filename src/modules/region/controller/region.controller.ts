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

import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { FilterDto } from '../dto/filter.dto';
import { RolesGuard } from '../../../common/guard/role.guard';
import { RoleEnum } from '../../../common/constant/role.constant';
import { Roles } from '../../../common/decorator/role.decorator';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';

@ApiTags('Region')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SUPERADMIN])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateRegionDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.parent_id = dto.parent_id ?? jwtPayload?.region?.id;
    return await this.regionService.create(dto);
  }

  @Get()
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) filter.region_id = filter.region_id ?? jwtPayload?.region?.id;

    return await this.regionService.getAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.regionService.getOneById(id);
    if (!result) throw new BadRequestException('region is not found!');
    return result;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SUPERADMIN])
  async update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number, @Body() dto: UpdateRegionDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.parent_id = dto.parent_id ?? jwtPayload?.region?.id;
    return await this.regionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SUPERADMIN])
  async remove(@Param('id') id: number) {
    return await this.regionService.remove(id);
  }

  @Post('/restore/:id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SUPERADMIN])
  async restore(@Param('id') id: number) {
    return await this.regionService.restore(id);
  }
}
