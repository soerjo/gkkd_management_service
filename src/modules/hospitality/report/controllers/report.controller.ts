import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { FindAllReportDto } from '../dto/find-all-report.dto';

@ApiTags('Hospitality')
@Controller('hospitality/report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto, @CurrentUser() jwtPayload: IJwtPayload) {
    return this.reportService.create(createReportDto, jwtPayload);
  }

  @Get()
  findAll(@Query() dto: FindAllReportDto, @CurrentUser() jwtPayload: IJwtPayload) {
    return this.reportService.findAll(dto, jwtPayload);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string, @CurrentUser() jwtPayload: IJwtPayload) {
  //   return this.reportService.findOne(+id, jwtPayload);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto, @CurrentUser() jwtPayload: IJwtPayload) {
  //   return this.reportService.update(+id, updateReportDto, jwtPayload);
  // }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() jwtPayload: IJwtPayload) {
    return this.reportService.remove(+id, jwtPayload);
  }
}
