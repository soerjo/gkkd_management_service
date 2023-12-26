import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PemuridanService } from './pemuridan.service';
import { CreatePemuridanDto } from './dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from './dto/update-pemuridan.dto';

@Controller('pemuridan')
export class PemuridanController {
  constructor(private readonly pemuridanService: PemuridanService) {}

  @Post()
  create(@Body() createPemuridanDto: CreatePemuridanDto) {
    return this.pemuridanService.create(createPemuridanDto);
  }

  @Get()
  findAll() {
    return this.pemuridanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pemuridanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePemuridanDto: UpdatePemuridanDto) {
    return this.pemuridanService.update(+id, updatePemuridanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pemuridanService.remove(+id);
  }
}
