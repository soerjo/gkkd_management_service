import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JadwalIbadahService } from '../services/jadwal-ibadah.service';
import { CreateJadwalIbadahDto } from '../dto/create-jadwal-ibadah.dto';
import { UpdateJadwalIbadahDto } from '../dto/update-jadwal-ibadah.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cermon')
@Controller('cermon')
export class JadwalIbadahController {
  constructor(private readonly jadwalIbadahService: JadwalIbadahService) {}

  @Post()
  create(@Body() createJadwalIbadahDto: CreateJadwalIbadahDto) {
    return this.jadwalIbadahService.create(createJadwalIbadahDto);
  }

  @Get()
  findAll() {
    return this.jadwalIbadahService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jadwalIbadahService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJadwalIbadahDto: UpdateJadwalIbadahDto) {
    return this.jadwalIbadahService.update(+id, updateJadwalIbadahDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jadwalIbadahService.remove(+id);
  }
}
