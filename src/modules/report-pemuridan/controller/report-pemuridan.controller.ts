import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportPemuridanService } from '../services/report-pemuridan.service';
import { CreateReportPemuridanDto } from '../dto/create-report-pemuridan.dto';
import { UpdateReportPemuridanDto } from '../dto/update-report-pemuridan.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';

@ApiTags('Pemuridan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pemuridan/report')
export class ReportPemuridanController {
  constructor(private readonly reportPemuridanService: ReportPemuridanService) {}

  @Post()
  async create(@Body() createReportPemuridanDto: CreateReportPemuridanDto) {
    return {
      message: "success",
      data: await this.reportPemuridanService.create(createReportPemuridanDto),
    } 
  }

  @Get()
  async findAll(@Query() filter: FilterDto) {
    return {
      message: "success",
      data: await this.reportPemuridanService.findAll(filter),
    } 
  }

  @Get(':id')
  async findOne(@UUIDParam() @Param('id') id: string) {
    return {
      message: "success",
      data: await this.reportPemuridanService.findOne(id),
    } 
  }

  @Patch(':id')
  async update(@UUIDParam() @Param('id') id: string, @Body() updateReportPemuridanDto: UpdateReportPemuridanDto) {
    return {
      message: "success",
      data: await this.reportPemuridanService.update(id, updateReportPemuridanDto),
    } 
  }

  @Delete(':id')
  async remove(@UUIDParam() @Param('id') id: string) {
    return {
      message: "success",
      data: await this.reportPemuridanService.remove(id),
    } 
  }
}
