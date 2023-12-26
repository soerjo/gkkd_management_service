import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JemaatService } from '../services/jemaat.service';
import { CreateJemaatDto } from '../dto/create-jemaat.dto';
import { UpdateJemaatDto } from '../dto/update-jemaat.dto';

@Controller('jemaat')
export class JemaatController {
  constructor(private readonly jemaatService: JemaatService) {}

  @Post()
  create(@Body() createJemaatDto: CreateJemaatDto) {
    return this.jemaatService.create(createJemaatDto);
  }

  @Get()
  findAll() {
    return this.jemaatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jemaatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJemaatDto: UpdateJemaatDto) {
    return this.jemaatService.update(+id, updateJemaatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jemaatService.remove(+id);
  }
}
