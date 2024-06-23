import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { CreateParameterDto } from './dto/create-parameter.dto';
import { UpdateParameterDto } from './dto/update-parameter.dto';

@Controller('parameter')
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @Post()
  create(@Body() createParameterDto: CreateParameterDto) {
    return this.parameterService.create(createParameterDto);
  }

  @Get()
  findAll() {
    return this.parameterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parameterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParameterDto: UpdateParameterDto) {
    return this.parameterService.update(+id, updateParameterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parameterService.remove(+id);
  }
}
