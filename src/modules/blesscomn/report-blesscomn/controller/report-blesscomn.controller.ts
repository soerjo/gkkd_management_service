import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ReportBlesscomnService } from '../services/report-blesscomn.service';
import { CreateReportBlesscomnDto } from '../dto/create-report-blesscomn.dto';
import { UpdateReportBlesscomnDto } from '../dto/update-report-blesscomn.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';

import { FilterDto } from '../dto/filter.dto';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { BlesscomnService } from '../../../../modules/blesscomn/blesscomn/services/blesscomn.service';

@ApiTags('Blesscomn')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/blesscomn/report')
export class ReportBlesscomnController {
  constructor(
    private readonly reportBlesscomnService: ReportBlesscomnService,
    private readonly blesscomnService: BlesscomnService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateReportBlesscomnDto) {
    if (jwtPayload.jemaat_id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.jemaat_id);
      dto.blesscomn_id = blesscomn.id;
    }
    return this.reportBlesscomnService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SUPERADMIN) filter.region_id = jwtPayload?.region?.id;

    if (jwtPayload.jemaat_id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.jemaat_id);
      filter.blesscomn_id = blesscomn.id;
    }

    return this.reportBlesscomnService.findAll(filter);
  }

  @Get('chart')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async getChart(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SUPERADMIN) filter.region_id = jwtPayload?.region?.id;

    if (jwtPayload.jemaat_id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.jemaat_id);
      filter.blesscomn_id = blesscomn.id;
    }

    return this.reportBlesscomnService.chart(filter);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async findOne(@Param('id') id: number) {
    const result = await this.reportBlesscomnService.findOne(id);
    if (!result) throw new BadRequestException('blesscomn report is not found!');
    return result;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('id') id: number,
    @Body() updateReportBlesscomnDto: UpdateReportBlesscomnDto,
  ) {
    if (jwtPayload.jemaat_id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.jemaat_id);
      updateReportBlesscomnDto.blesscomn_id = blesscomn.id;
    }
    return this.reportBlesscomnService.update(id, updateReportBlesscomnDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async remove(@Param('id') id: number) {
    await this.reportBlesscomnService.remove(id);
  }
}
