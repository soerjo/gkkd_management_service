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
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

import { FilterDto } from '../dto/filter.dto';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { BlesscomnService } from 'src/modules/blesscomn/blesscomn/services/blesscomn.service';

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
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() createReportBlesscomnDto: CreateReportBlesscomnDto) {
    if (jwtPayload.jemaat_id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.jemaat_id);
      createReportBlesscomnDto.blesscomn_id = blesscomn.id;
    }

    return {
      message: 'success',
      data: await this.reportBlesscomnService.create(createReportBlesscomnDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    console.log('get report blesscomn !');
    if (jwtPayload.role !== RoleEnum.ROLE_SUPERADMIN) filter.region_id = jwtPayload?.region?.id;

    if (jwtPayload.jemaat_id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.jemaat_id);
      filter.blesscomn_id = blesscomn.id;
    }

    return {
      message: 'success',
      data: await this.reportBlesscomnService.findAll(filter),
    };
  }

  @Get('chart')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async getChart(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SUPERADMIN) filter.region_id = jwtPayload?.region?.id;

    if (jwtPayload.jemaat_id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.jemaat_id);
      filter.blesscomn_id = blesscomn.id;
    }

    return {
      message: 'success',
      data: await this.reportBlesscomnService.chart(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async findOne(@Param('id') id: number) {
    const result = await this.reportBlesscomnService.findOne(id);
    if (!result) throw new BadRequestException('blesscomn report is not found!');
    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('id') id: number,
    @Body() updateReportBlesscomnDto: UpdateReportBlesscomnDto,
  ) {
    if (jwtPayload.jemaat_id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.jemaat_id);
      updateReportBlesscomnDto.blesscomn_id = blesscomn.id;
    }

    return {
      message: 'success',
      data: await this.reportBlesscomnService.update(id, updateReportBlesscomnDto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async remove(@Param('id') id: number) {
    return {
      message: 'success',
      data: await this.reportBlesscomnService.remove(id),
    };
  }
}
