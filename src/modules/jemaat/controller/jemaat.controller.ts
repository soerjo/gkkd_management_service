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
import { JemaatService } from '../services/jemaat.service';
import { CreateJemaatDto } from '../dto/create-jemaat.dto';
import { UpdateJemaatDto } from '../dto/update-jemaat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

import { FilterDto } from '../dto/filter.dto';
import { RoleEnum } from 'src/common/constant/role.constant';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';

@ApiTags('Jemaat')
@Controller('jemaat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class JemaatController {
  constructor(private readonly jemaatService: JemaatService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.SYSTEMADMIN, RoleEnum.ADMIN])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateJemaatDto) {
    if (jwtPayload.role !== RoleEnum.SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;

    return {
      message: 'success',
      data: await this.jemaatService.create(dto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.SYSTEMADMIN, RoleEnum.ADMIN])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.SYSTEMADMIN) filter.region_id = jwtPayload?.region?.id;

    return {
      message: 'success',
      data: await this.jemaatService.findAll(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.SYSTEMADMIN, RoleEnum.ADMIN])
  async findOne(@Param('id') id: number) {
    const result = await this.jemaatService.findOne(id);
    if (!result) throw new BadRequestException({ message: 'result is not found!' });

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.SYSTEMADMIN, RoleEnum.ADMIN])
  async update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number, @Body() dto: UpdateJemaatDto) {
    if (jwtPayload.role !== RoleEnum.SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;

    return {
      message: 'success',
      data: await this.jemaatService.update(id, dto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.SYSTEMADMIN])
  async remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    let region_id: number;
    if (jwtPayload.role !== RoleEnum.SYSTEMADMIN) region_id = jwtPayload?.region?.id;
    return {
      message: 'success',
      data: await this.jemaatService.remove(id, region_id),
    };
  }
}
