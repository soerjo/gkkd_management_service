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
  BadRequestException,
} from '@nestjs/common';
import { BlesscomnService } from '../services/blesscomn.service';
import { CreateBlesscomnDto } from '../dto/create-blesscomn.dto';
import { UpdateBlesscomnDto } from '../dto/update-blesscomn.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';

@ApiTags('Blesscomn')
@Controller('blesscomn')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BlesscomnController {
  constructor(private readonly blesscomnService: BlesscomnService) {}

  @Post()
  async create(@Body() createBlesscomnDto: CreateBlesscomnDto) {
    return {
      message: 'success',
      data: await this.blesscomnService.create(createBlesscomnDto),
    };
  }

  @Get()
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    filter.region_ids = jwtPayload.regions && jwtPayload.regions.map((val) => val.id);

    return {
      message: 'success',
      data: await this.blesscomnService.findAll(filter),
    };
  }

  @Get(':id')
  async findOne(@UUIDParam() @Param('id') id: string) {
    const result = await this.blesscomnService.findOne(id);
    if (!result) throw new BadRequestException({ message: 'blesscomn is not found!' });

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  async update(@UUIDParam() @Param('id') id: string, @Body() updateBlesscomnDto: UpdateBlesscomnDto) {
    return {
      message: 'success',
      data: await this.blesscomnService.update(id, updateBlesscomnDto),
    };
  }

  @Delete(':id')
  async remove(@UUIDParam() @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.blesscomnService.remove(id),
    };
  }
}
