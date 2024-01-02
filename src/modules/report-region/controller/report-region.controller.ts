import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportRegionService } from '../services/report-region.service';
import { CreateReportRegionDto } from '../dto/create-report-region.dto';
import { UpdateReportRegionDto } from '../dto/update-report-region.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';

@ApiTags('Region')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('region/report')
export class ReportRegionController {
  constructor(private readonly reportRegionService: ReportRegionService) {}

  @Post()
  async create(@Body() createReportRegionDto: CreateReportRegionDto) {
    return {
      message: "success",
      data: await this.reportRegionService.create(createReportRegionDto),
    } 
  }

  @Get()
  async findAll(@Query() filter: FilterDto) {
    return {
      message: "success",
      data: await this.reportRegionService.findAll(filter),
    } 
  }

  @Get(':id')
  async findOne(@UUIDParam() @Param('id') id: string) {
    return {
      message: "success",
      data: await this.reportRegionService.findOne(id),
    } 
  }

  @Patch(':id')
  async update(@UUIDParam() @Param('id') id: string, @Body() updateReportRegionDto: UpdateReportRegionDto) {
    return {
      message: "success",
      data: await this.reportRegionService.update(id, updateReportRegionDto),
    } 
  }

  @Delete(':id')
  async remove(@UUIDParam() @Param('id') id: string) {
    return {
      message: "success",
      data: await this.reportRegionService.remove(id),
    } 
  }
}
