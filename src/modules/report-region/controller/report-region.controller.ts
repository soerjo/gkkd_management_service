import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportRegionService } from '../services/report-region.service';
import { CreateReportRegionDto } from '../dto/create-report-region.dto';
import { UpdateReportRegionDto } from '../dto/update-report-region.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

import { FilterDto } from '../dto/filter.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';

@ApiTags('Sunday Service Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/report/sunday-service')
export class ReportRegionController {
  constructor(private readonly reportRegionService: ReportRegionService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() createReportRegionDto: CreateReportRegionDto) {
    return {
      message: 'success',
      data: await this.reportRegionService.create(createReportRegionDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.SUPERADMIN) filter.region_id = jwtPayload.region.id;

    return {
      message: 'success',
      data: await this.reportRegionService.findAll(filter),
    };
  }

  @Get('chart')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async getChart(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.SUPERADMIN) filter.region_id = jwtPayload.region.id;

    return {
      message: 'success',
      data: await this.reportRegionService.chart(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async findOne(@Param('id') id: number) {
    return {
      message: 'success',
      data: await this.reportRegionService.findOne(id),
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('id') id: number,
    @Body() updateReportRegionDto: UpdateReportRegionDto,
  ) {
    return {
      message: 'success',
      data: await this.reportRegionService.update(id, updateReportRegionDto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async remove(@Param('id') id: number) {
    return {
      message: 'success',
      data: await this.reportRegionService.remove(id),
    };
  }
}
