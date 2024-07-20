import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ReportIbadahService } from '../services/cermon-report.service';
import { CreateReportIbadahDto } from '../dto/create-report-ibadah.dto';
import { UpdateReportIbadahDto } from '../dto/update-report-ibadah.dto';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { FilterReportDto } from '../dto/filter.dto';

@ApiTags('Cermon')
@Controller('cermon/report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
export class ReportIbadahController {
  constructor(private readonly reportIbadahService: ReportIbadahService) {}

  @Post()
  create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateReportIbadahDto) {
    return this.reportIbadahService.create(dto);
  }

  @Get()
  findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() dto: FilterReportDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    return this.reportIbadahService.findAll(dto);
  }

  @Get(':id')
  findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    return this.reportIbadahService.findOne(+id, jwtPayload?.region?.id);
  }

  @Patch(':id')
  update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string, @Body() dto: UpdateReportIbadahDto) {
    return this.reportIbadahService.update(+id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    return this.reportIbadahService.remove(+id, jwtPayload?.region?.id);
  }
}
