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
  Res,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ReportIbadahService } from '../services/cermon-report.service';
import { CreateReportIbadahDto } from '../dto/create-report-ibadah.dto';
import { UpdateReportIbadahDto } from '../dto/update-report-ibadah.dto';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { FilterReportDto } from '../dto/filter.dto';
import { Response } from 'express';
import { JadwalIbadahService } from '../../cermon-schedule/services/jadwal-ibadah.service';
import { CermonScheduleEntity } from '../../cermon-schedule/entities/cermon-schedule.entity';
import { read, utils, write } from 'xlsx';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDto } from '../dto/upload.dto';
import { CermonSchedulerService } from '../../cermon-scheduler/cermon-scheduler.service';

@ApiTags('Cermon')
@Controller('cermon/report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles([RoleEnum.ROLE_SUPERADMIN])
export class ReportIbadahController {
  constructor(
    private readonly reportIbadahService: ReportIbadahService,
    private readonly cermonService: JadwalIbadahService,
    @Inject(forwardRef(() => CermonSchedulerService))
    private readonly cermonSchedulerService: CermonSchedulerService,
  ) {}

  @Post()
  create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateReportIbadahDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    return this.reportIbadahService.create(dto);
  }

  @Get()
  findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() dto: FilterReportDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    return this.reportIbadahService.findAll(dto);
  }

  @Get('reminder')
  trigerRimender(@CurrentUser() jwtPayload: IJwtPayload, @Query() dto: FilterReportDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    return this.cermonSchedulerService.handletWeekly(dto.region_id);
  }

  @Get('dashboard')
  getDasboardData(@CurrentUser() jwtPayload: IJwtPayload, @Query() dto: FilterReportDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    return this.reportIbadahService.getDashboardData(dto);
  }

  @Get('export')
  async exportXlsxFile(@CurrentUser() jwtPayload: IJwtPayload, @Res() res: Response) {
    let cermon_ids;
    const { entities: cermon } = await this.cermonService.findAll({ region_id: jwtPayload.region.id });
    cermon_ids = (cermon as CermonScheduleEntity[]).map((bc: CermonScheduleEntity) => bc.id);

    const buffer = await this.reportIbadahService.export(cermon_ids);

    let ws = utils.json_to_sheet(buffer);
    let wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    let buf = write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.header('Content-disposition', 'attachment; filename=report.xlsx');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buf);
  }

  @Get('sync/all')
  syncAll(@CurrentUser() jwtPayload: IJwtPayload) {
    return this.reportIbadahService.syncAll(jwtPayload?.region?.id);
  }

  @Get('sync/:id')
  syncById(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    return this.reportIbadahService.syncById(+id, jwtPayload?.region?.id);
  }

  @Get(':id')
  findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    return this.reportIbadahService.findOne(+id, jwtPayload?.region?.id);
  }

  @Patch(':id')
  update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string, @Body() dto: UpdateReportIbadahDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    return this.reportIbadahService.update(+id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    return this.reportIbadahService.remove(+id, jwtPayload?.region?.id);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  async uploadXlsxFile(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: UploadDto) {
    let cermon_ids: string[] = [];
    const { entities: cermon } = await this.cermonService.findAll({ region_id: jwtPayload.region.id });
    cermon_ids = (cermon as CermonScheduleEntity[]).map((bc: CermonScheduleEntity) => bc.unique_id);

    const wb = read(dto.file.buffer, { cellDates: true });
    const sheetName = wb.SheetNames[0];
    const workSheet = wb.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(workSheet);

    await this.reportIbadahService.upload(jsonData, cermon_ids);
  }
}
