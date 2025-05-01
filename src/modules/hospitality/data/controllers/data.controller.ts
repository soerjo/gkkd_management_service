import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DataService } from '../services/data.service';
import { CreateDatumDto } from '../dto/create-datum.dto';
import { UpdateDatumDto } from '../dto/update-datum.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@ApiTags('Hospitality')
@Controller('hospitality/data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
  create(@Body() createDatumDto: CreateDatumDto) {
    return this.dataService.create(createDatumDto);
  }

  @Get()
  findAll() {
    return this.dataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatumDto: UpdateDatumDto) {
    return this.dataService.update(+id, updateDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataService.remove(+id);
  }
}
