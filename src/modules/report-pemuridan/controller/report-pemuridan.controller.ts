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
  ForbiddenException,
} from '@nestjs/common';
import { ReportPemuridanService } from '../services/report-pemuridan.service';
import { CreateReportPemuridanDto } from '../dto/create-report-pemuridan.dto';
import { UpdateReportPemuridanDto } from '../dto/update-report-pemuridan.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { PemuridanRepository } from 'src/modules/pemuridan/repository/pemuridan.repository';

@ApiTags('Pemuridan Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pemuridan_report')
export class ReportPemuridanController {
  constructor(
    private readonly reportPemuridanService: ReportPemuridanService,
    private readonly pemuridanRepository: PemuridanRepository,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() createReportPemuridanDto: CreateReportPemuridanDto) {
    if (jwtPayload.jemaat_id && jwtPayload.role.some((val) => val === RoleEnum.PEMBIMBING)) {
      const isValidLead = await this.pemuridanRepository.findOne({
        where: {
          id: createReportPemuridanDto.pemuridan_id,
          lead: { id: jwtPayload.jemaat_id },
        },
      });
      if (!isValidLead) throw new ForbiddenException();
    }

    return {
      message: 'success',
      data: await this.reportPemuridanService.create(createReportPemuridanDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.jemaat_id) filter.lead_id = jwtPayload.jemaat_id;

    return {
      message: 'success',
      data: await this.reportPemuridanService.findAll(filter),
    };
  }

  @Get('chart')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async getChart(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.jemaat_id) filter.lead_id = jwtPayload.jemaat_id;

    return {
      message: 'success',
      data: await this.reportPemuridanService.chart(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @UUIDParam() @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.reportPemuridanService.findOne(id),
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @UUIDParam() @Param('id') id: string,
    @Body() updateReportPemuridanDto: UpdateReportPemuridanDto,
  ) {
    if (jwtPayload.jemaat_id && jwtPayload.role.some((val) => val === RoleEnum.PEMBIMBING)) {
      const isValidLead = await this.pemuridanRepository.findOne({
        where: {
          id: updateReportPemuridanDto.pemuridan_id,
          lead: { id: jwtPayload.jemaat_id },
        },
      });
      if (!isValidLead) throw new ForbiddenException();
    }

    return {
      message: 'success',
      data: await this.reportPemuridanService.update(id, updateReportPemuridanDto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async remove(@UUIDParam() @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.reportPemuridanService.remove(id),
    };
  }
}
