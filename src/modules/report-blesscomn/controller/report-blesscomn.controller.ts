import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportBlesscomnService } from '../services/report-blesscomn.service';
import { CreateReportBlesscomnDto } from '../dto/create-report-blesscomn.dto';
import { UpdateReportBlesscomnDto } from '../dto/update-report-blesscomn.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { BlesscomnService } from 'src/modules/blesscomn/services/blesscomn.service';

@ApiTags('Blesscomn Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('blesscomn_report')
export class ReportBlesscomnController {
  constructor(
    private readonly reportBlesscomnService: ReportBlesscomnService,
    private readonly blesscomnService: BlesscomnService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
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
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.regions.length) filter.region_id = jwtPayload.regions[0].id;

    if (jwtPayload.jemaat_id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.jemaat_id);
      filter.blesscomn_id = blesscomn.id;
    }

    return {
      message: 'success',
      data: await this.reportBlesscomnService.findAll(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async findOne(@UUIDParam() @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.reportBlesscomnService.findOne(id),
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async update(@UUIDParam() @Param('id') id: string, @Body() updateReportBlesscomnDto: UpdateReportBlesscomnDto) {
    return {
      message: 'success',
      data: await this.reportBlesscomnService.update(id, updateReportBlesscomnDto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMIMPIN_PERSEKUTUAN])
  async remove(@UUIDParam() @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.reportBlesscomnService.remove(id),
    };
  }
}
