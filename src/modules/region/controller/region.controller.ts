import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { RegionService } from '../services/region.service';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@ApiTags('Region')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  async create(@Body() createRegionDto: CreateRegionDto) {
    return {
      message: 'success',
      data: await this.regionService.create(createRegionDto),
    };
  }

  @Get()
  async findAll() {
    return {
      message: 'success',
      data: await this.regionService.getAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') @UUIDParam() id: string) {
    const result = await this.regionService.getOneById(id);
    if (!result)
      throw new BadRequestException({ message: 'region is not found!' });

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') @UUIDParam() id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ) {
    return {
      message: 'success',
      data: await this.regionService.update(id, updateRegionDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') @UUIDParam() id: string) {
    return {
      message: 'success',
      data: await this.regionService.remove(id),
    };
  }
}
