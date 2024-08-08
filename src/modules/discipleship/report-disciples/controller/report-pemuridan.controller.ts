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
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportPemuridanService } from '../services/report-pemuridan.service';
import { CreateReportPemuridanDto } from '../dto/create-report-pemuridan.dto';
import { UpdateReportPemuridanDto } from '../dto/update-report-pemuridan.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';

import { FilterDto } from '../dto/filter.dto';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { DisciplesService } from '../../disciples/services/disciples.service';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDto } from '../dto/upload.dto';
import { read, utils, write } from 'xlsx';
import { DisciplesGroupService } from '../../disciples-group/services/disciples.service';

@ApiTags('Pemuridan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pemuridan-report')
export class ReportPemuridanController {
  constructor(
    private readonly reportPemuridanService: ReportPemuridanService,
    private readonly pemuridanService: DisciplesService,
    private readonly groupPemuridanService: DisciplesGroupService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateReportPemuridanDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;

    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('disciple account is not found!');
    }

    if (!dto.region_id) throw new BadRequestException('region is not found!');

    return this.reportPemuridanService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    filter.region_id = filter.region_id ?? jwtPayload?.region?.id;
    filter.region_tree_id = filter.region_id;
    if (!filter.region_id) throw new BadRequestException('region is not found!');

    if (filter.pembimbing_nim) {
      const disciple = await this.pemuridanService.getAccountDiscipleByNim(filter.pembimbing_nim);
      if (!disciple) throw new BadRequestException('disciple account is not found!');
      filter.pembimbing_id = disciple.id;
    }

    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('disciple account is not found!');
      filter.pembimbing_nim = filter.pembimbing_nim ?? parent.nim;
      filter.pembimbing_id = filter.pembimbing_id ?? parent.id;
    }

    return this.reportPemuridanService.findAll(filter);
  }

  @Get('export')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async exportXlsxFile(@CurrentUser() jwtPayload: IJwtPayload, @Res() res: Response) {
    let disciple_group_ids: string[];

    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const group = await this.groupPemuridanService.getByPembimbingNim(jwtPayload.username);
      disciple_group_ids = group.map((group) => group.unique_id);
    }

    const buffer = await this.reportPemuridanService.export(disciple_group_ids);

    let ws = utils.json_to_sheet(buffer);
    var wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    var buf = write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.header('Content-disposition', 'attachment; filename=report.xlsx');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buf);
  }

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
      if (!parent) throw new BadRequestException('disciple account is not found!');
    }

    if (!dto.region_id) throw new BadRequestException('region is not found!');

    return this.reportPemuridanService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async remove(@Param('id') id: number) {
    await this.reportPemuridanService.remove(id);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async uploadXlsxFile(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: UploadDto) {
    let disciple_group_ids;
    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const group = await this.groupPemuridanService.getByPembimbingNim(jwtPayload.username);
      disciple_group_ids = group.map((group) => group.id);
    }

    const wb = read(dto.file.buffer, { cellDates: true });
    const sheetName = wb.SheetNames[0];
    const workSheet = wb.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(workSheet);

    await this.reportPemuridanService.upload(jsonData, disciple_group_ids);
  }
}
