import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportIbadahService } from '../services/cermon-report.service';
import { CreateReportIbadahDto } from '../dto/create-report-ibadah.dto';
import { UpdateReportIbadahDto } from '../dto/update-report-ibadah.dto';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@ApiTags('Cermon')
@Controller('cermon/report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ReportIbadahController {
  constructor(
    private readonly reportIbadahService: ReportIbadahService,
    // private readonly
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
  create(@Body() createReportIbadahDto: CreateReportIbadahDto) {
    return this.reportIbadahService.create(createReportIbadahDto);
  }

  @Get()
  findAll() {
    return this.reportIbadahService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportIbadahService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
  update(@Param('id') id: string, @Body() updateReportIbadahDto: UpdateReportIbadahDto) {
    return this.reportIbadahService.update(+id, updateReportIbadahDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
  remove(@Param('id') id: string) {
    return this.reportIbadahService.remove(+id);
  }
}
