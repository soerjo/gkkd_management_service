import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadGatewayException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PemuridanService } from '../services/pemuridan.service';
import { CreatePemuridanDto } from '../dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from '../dto/update-pemuridan.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { JemaatService } from 'src/modules/jemaat/services/jemaat.service';
import { FilterDto } from '../dto/filter.dto';

@ApiTags('Pemuridan')
@Controller('pemuridan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PemuridanController {
  constructor(
    private readonly pemuridanService: PemuridanService,
  ) {}

  @Post()
  async create(@Body() createPemuridanDto: CreatePemuridanDto) {
    return {
      message: 'success',
      data: await this.pemuridanService.create(createPemuridanDto),
    };
  }

  @Get()
  async findAll(@Query() filter: FilterDto) {
    return {
      message: 'success',
      data: await this.pemuridanService.findAll(filter),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.pemuridanService.findOne(id);
    if (!result)
      throw new BadRequestException({ message: 'pemuridan is not found!' });

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePemuridanDto: UpdatePemuridanDto,
  ) {
    return {
      message: 'success',
      data: await this.pemuridanService.update(id, updatePemuridanDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      message: 'success',
      data: await this.pemuridanService.remove(id),
    };
  }
}
