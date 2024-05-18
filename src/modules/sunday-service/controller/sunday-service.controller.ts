import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SundayServiceService } from '../services/sunday-service.service';
import { CreateSundayServiceDto } from '../dto/create-sunday-service.dto';
import { UpdateSundayServiceDto } from '../dto/update-sunday-service.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { RolesGuard } from 'src/common/guard/role.guard';
import { RoleEnum } from 'src/common/constant/role.constant';
import { Roles } from 'src/common/decorator/role.decorator';
import { FilterDto } from '../dto/filter.dto';

@ApiTags('Sunday Service')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sunday-service')
export class SundayServiceController {
  constructor(private readonly sundayServiceService: SundayServiceService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateSundayServiceDto) {
    if (jwtPayload.role !== RoleEnum.SUPERADMIN) dto.region_id = jwtPayload.region.id;

    return {
      message: 'success',
      data: await this.sundayServiceService.create(dto),
    };
  }

  @Get()
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.SUPERADMIN) filter.region_id = jwtPayload.region.id;

    return {
      message: 'success',
      data: await this.sundayServiceService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string, filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.SUPERADMIN) filter.region_id = jwtPayload.region.id;

    return {
      message: 'success',
      data: await this.sundayServiceService.findOne(id),
    };
  }

  @Patch(':id')
  async update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string, @Body() dto: UpdateSundayServiceDto) {
    if (jwtPayload.role !== RoleEnum.SUPERADMIN) dto.region_id = jwtPayload.region.id;

    return {
      message: 'success',
      data: this.sundayServiceService.update(id, dto),
    };
  }

  @Delete(':id')
  async remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.sundayServiceService.remove(id),
    };
  }
}
