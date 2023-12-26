import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JemaatService } from '../services/jemaat.service';
import { CreateJemaatDto } from '../dto/create-jemaat.dto';
import { UpdateJemaatDto } from '../dto/update-jemaat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';

@ApiTags('Jemaat')
@Controller('jemaat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class JemaatController {
  constructor(private readonly jemaatService: JemaatService) {}

  @Post()
  async create(@Body() createJemaatDto: CreateJemaatDto) {
    return {
      message: 'success',
      data: await this.jemaatService.create(createJemaatDto),
    };
  }

  @Get()
  async findAll(@Query() filter: FilterDto) {
    return {
      message: 'success',
      data: await this.jemaatService.findAll(filter),
    };
  }

  @Get(':id')
  async findOne(@UUIDParam() @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.jemaatService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @UUIDParam() @Param('id') id: string,
    @Body() updateJemaatDto: UpdateJemaatDto,
  ) {
    return {
      message: 'success',
      data: await this.jemaatService.update(id, updateJemaatDto),
    };
  }

  @Delete(':id')
  async remove(@UUIDParam() @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.jemaatService.remove(id),
    };
  }
}
