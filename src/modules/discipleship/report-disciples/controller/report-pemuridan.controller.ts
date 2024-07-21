import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportPemuridanService } from '../services/report-pemuridan.service';
import { CreateReportPemuridanDto } from '../dto/create-report-pemuridan.dto';
import { UpdateReportPemuridanDto } from '../dto/update-report-pemuridan.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';

import { FilterDto } from '../dto/filter.dto';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RolesGuard } from '../../../../common/guard/role.guard';

@ApiTags('Pemuridan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pemuridan/report')
export class ReportPemuridanController {
  constructor(private readonly reportPemuridanService: ReportPemuridanService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() createReportPemuridanDto: CreateReportPemuridanDto) {
    // if (jwtPayload.jemaat_id && jwtPayload.role.some((val) => val ==RoleEnum.DISCIPLES)) {
    //   const isValidLead = await this.pemuridanRepository.findOne({
    //     where: {
    //       id: createReportPemuridanDto.pemuridan_id,
    //       lead: { id: jwtPayload.jemaat_id },
    //     },
    //   });
    //   if (!isValidLead) throw new ForbiddenException();
    // }

    return {
      message: 'success',
      data: await this.reportPemuridanService.create(createReportPemuridanDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.jemaat_id) filter.lead_id = jwtPayload.jemaat_id;

    return {
      message: 'success',
      data: await this.reportPemuridanService.findAll(filter),
    };
  }

  @Get('chart')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async getChart(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.jemaat_id) filter.lead_id = jwtPayload.jemaat_id;

    return {
      message: 'success',
      data: await this.reportPemuridanService.chart(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    return {
      message: 'success',
      data: await this.reportPemuridanService.findOne(id),
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('id') id: number,
    @Body() updateReportPemuridanDto: UpdateReportPemuridanDto,
  ) {
    // if (jwtPayload.jemaat_id && jwtPayload.role.some((val) => val ==RoleEnum.DISCIPLES)) {
    //   const isValidLead = await this.pemuridanRepository.findOne({
    //     where: {
    //       id: updateReportPemuridanDto.pemuridan_id,
    //       lead: { id: jwtPayload.jemaat_id },
    //     },
    //   });
    //   if (!isValidLead) throw new ForbiddenException();
    // }

    return {
      message: 'success',
      data: await this.reportPemuridanService.update(id, updateReportPemuridanDto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async remove(@Param('id') id: number) {
    return {
      message: 'success',
      data: await this.reportPemuridanService.remove(id),
    };
  }
}
