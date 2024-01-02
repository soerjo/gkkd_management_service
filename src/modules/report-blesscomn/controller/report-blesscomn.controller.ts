import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportBlesscomnService } from '../services/report-blesscomn.service';
import { CreateReportBlesscomnDto } from '../dto/create-report-blesscomn.dto';
import { UpdateReportBlesscomnDto } from '../dto/update-report-blesscomn.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';

@ApiTags('Blesscomn')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('blesscomn/report')
export class ReportBlesscomnController {
  constructor(private readonly reportBlesscomnService: ReportBlesscomnService) {}

  @Post()
  async create(@Body() createReportBlesscomnDto: CreateReportBlesscomnDto) {
    return {
      message: "success",
      data: await this.reportBlesscomnService.create(createReportBlesscomnDto),
    } 
  }

  @Get()
  async findAll(@Query() filter: FilterDto) {
    return {
      message: "success",
      data: await this.reportBlesscomnService.findAll(filter),
    } 
  }

  @Get(':id')
  async findOne(@UUIDParam() @Param('id') id: string) {
    return {
      message: "success",
      data: await this.reportBlesscomnService.findOne(id),
    } 
  }

  @Patch(':id')
  async update(@UUIDParam() @Param('id') id: string, @Body() updateReportBlesscomnDto: UpdateReportBlesscomnDto) {
    return {
      message: "success",
      data: await this.reportBlesscomnService.update(id, updateReportBlesscomnDto),
    } 
  }

  @Delete(':id')
  async remove(@UUIDParam() @Param('id') id: string) {
    return {
      message: "success",
      data: await this.reportBlesscomnService.remove(id),
    } 
  }
}
