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
  Res,
} from '@nestjs/common';
import { ReportBlesscomnService } from '../services/report-blesscomn.service';
import { CreateReportBlesscomnDto } from '../dto/create-report-blesscomn.dto';
import { UpdateReportBlesscomnDto } from '../dto/update-report-blesscomn.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';

import { FilterDto } from '../dto/filter.dto';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { BlesscomnService } from '../../../../modules/blesscomn/blesscomn/services/blesscomn.service';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDto } from '../dto/upload.dto';
import { read, utils, write } from 'xlsx';
import { Response } from 'express';

@ApiTags('Blesscomn')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/blesscomn-report')
export class ReportBlesscomnController {
  constructor(
    private readonly reportBlesscomnService: ReportBlesscomnService,
    private readonly blesscomnService: BlesscomnService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateReportBlesscomnDto) {
    if (jwtPayload.id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.id);
      const listBlesscomnIds = blesscomn.map((bc) => bc?.id);
      if (listBlesscomnIds.includes(dto.blesscomn_id)) {
        throw new BadRequestException('user have not this blesscomn, blesscomn is not valid');
      }
    }

    return this.reportBlesscomnService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SUPERADMIN) {
      filter.region_id = jwtPayload?.region?.id;
      filter.admin_id = jwtPayload.id;
    }

    if (jwtPayload.role === RoleEnum.LEADER) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.id);
      filter.blesscomn_ids = blesscomn.map((bc) => bc.id);
    }

    return this.reportBlesscomnService.findAll(filter);
  }

  @Get('chart')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async getChart(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SUPERADMIN) filter.region_id = jwtPayload?.region?.id;

    if (jwtPayload.role === RoleEnum.LEADER) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.id);
      filter.blesscomn_ids = blesscomn.map((bc) => bc.id);
    }

    return this.reportBlesscomnService.chart(filter);
  }

  @Get('export')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async exportXlsxFile(@CurrentUser() jwtPayload: IJwtPayload, @Res() res: Response) {
    let blesscomn_ids;
    if (jwtPayload.role === RoleEnum.LEADER) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.id);
      blesscomn_ids = blesscomn.map((bc) => bc.id);
    }

    const buffer = await this.reportBlesscomnService.export(blesscomn_ids);

    let ws = utils.json_to_sheet(buffer);
    let wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    let buf = write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.header('Content-disposition', 'attachment; filename=report.xlsx');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buf);
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
    if (jwtPayload.id) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.id);
      const listBlesscomnIds = blesscomn.map((bc) => bc.id);
      if (listBlesscomnIds.includes(updateReportBlesscomnDto.blesscomn_id)) {
        throw new BadRequestException('user have not this blesscomn, blesscomn is not valid');
      }
    }
    return this.reportBlesscomnService.update(id, updateReportBlesscomnDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async remove(@Param('id') id: number) {
    await this.reportBlesscomnService.remove(id);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async uploadXlsxFile(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: UploadDto) {
    let blesscomn_ids;
    if (jwtPayload.role === RoleEnum.LEADER) {
      const blesscomn = await this.blesscomnService.findOneByLeadId(jwtPayload.id);
      blesscomn_ids = blesscomn.map((bc) => bc.unique_id);
    }

    const wb = read(dto.file.buffer, { cellDates: true });
    const sheetName = wb.SheetNames[0];
    const workSheet = wb.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(workSheet);

    await this.reportBlesscomnService.upload(jsonData, blesscomn_ids);
  }
}
