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
import { DisciplesService } from '../../disciples/services/disciples.service';

@ApiTags('Pemuridan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('report/pemuridan')
export class ReportPemuridanController {
  constructor(
    private readonly reportPemuridanService: ReportPemuridanService,
    private readonly pemuridanService: DisciplesService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateReportPemuridanDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;

    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');
      dto.pembimbing_nim = parent.nim;
    }

    if (!dto.region_id) throw new BadRequestException('region is not found!');
    if (!dto.pembimbing_nim) throw new BadRequestException('pembimbing is not found!');

    return this.reportPemuridanService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    filter.region_id = filter.region_id ?? jwtPayload?.region?.id;

    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');
      filter.pembimbing_nim = parent.nim;
    }

    if (!filter.region_id) throw new BadRequestException('region is not found!');
    if (!filter.pembimbing_nim) throw new BadRequestException('pembimbing is not found!');

    return this.reportPemuridanService.findAll(filter);
  }

  // @Get('chart')
  // @UseGuards(RolesGuard)
  // @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  // async getChart(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
  //   if (jwtPayload.jemaat_id) filter.lead_id = jwtPayload.jemaat_id;

  //   return {
  //     message: 'success',
  //     data: await this.reportPemuridanService.chart(filter),
  //   };
  // }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    return await this.reportPemuridanService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number, @Body() dto: UpdateReportPemuridanDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;

    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');
      dto.pembimbing_nim = parent.nim;
    }

    if (!dto.region_id) throw new BadRequestException('region is not found!');
    if (!dto.pembimbing_nim) throw new BadRequestException('pembimbing is not found!');

    return this.reportPemuridanService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async remove(@Param('id') id: number) {
    await this.reportPemuridanService.remove(id);
  }
}
