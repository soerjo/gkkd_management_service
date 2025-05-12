import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { HospitalityDataService } from '../services/data.service';
import { CreateDatumDto } from '../dto/create-datum.dto';
import { UpdateDatumDto } from '../dto/update-datum.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { FindHospitalityData } from '../dto/find-hospitality-data.dto';

@ApiTags('Hospitality')
@Controller('hospitality/data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(private readonly dataService: HospitalityDataService) {}

  @Post()
  create(@Body() createDatumDto: CreateDatumDto, @CurrentUser() jwtPayload: IJwtPayload) {
    return this.dataService.create(createDatumDto, jwtPayload);
  }

  @Get()
  findAll(@Query() dto: FindHospitalityData, @CurrentUser() jwtPayload: IJwtPayload) {
    return this.dataService.findAll(dto, jwtPayload);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() jwtPayload: IJwtPayload) {
    return this.dataService.findOne(+id, jwtPayload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatumDto: UpdateDatumDto, @CurrentUser() jwtPayload: IJwtPayload) {
    return this.dataService.update(+id, updateDatumDto, jwtPayload);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() jwtPayload: IJwtPayload) {
    return this.dataService.remove(+id, jwtPayload);
  }
}
