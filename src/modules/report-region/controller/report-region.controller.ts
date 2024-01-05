import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportRegionService } from '../services/report-region.service';
import { CreateReportRegionDto } from '../dto/create-report-region.dto';
import { UpdateReportRegionDto } from '../dto/update-report-region.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';

@ApiTags('Region Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('region_report')
export class ReportRegionController {
  constructor(private readonly reportRegionService: ReportRegionService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async create(@Body() createReportRegionDto: CreateReportRegionDto) {
    return {
      message: 'success',
      data: await this.reportRegionService.create(createReportRegionDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload?.regions?.length) filter.region_id = jwtPayload.regions[0].id;

    return {
      message: 'success',
      data: await this.reportRegionService.findAll(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async findOne(@UUIDParam() @Param('id') id: string) {
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
    @UUIDParam() @Param('id') id: string,
    @Body() updateReportRegionDto: UpdateReportRegionDto,
  ) {
    if (jwtPayload?.regions?.length) updateReportRegionDto.region_id = jwtPayload.regions[0].id;

    return {
      message: 'success',
      data: await this.reportRegionService.update(id, updateReportRegionDto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async remove(@UUIDParam() @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.reportRegionService.remove(id),
    };
  }
}
