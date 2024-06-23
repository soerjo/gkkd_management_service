import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { MaritalService } from '../services/marital.service';
import { CreateMaritalDto } from '../dto/create-marital.dto';
import { UpdateMaritalDto } from '../dto/update-marital.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { FilterDto } from '../dto/filter.dto';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { RoleEnum } from 'src/common/constant/role.constant';
import { Roles } from 'src/common/decorator/role.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@ApiTags('Marital')
@Controller('marital')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
export class MaritalController {
  constructor(private readonly maritalService: MaritalService) {}

  @Post()
  create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateMaritalDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;
    if (!dto.region_id) throw new BadRequestException('region is not found');

    return this.maritalService.create(dto);
  }

  @Get()
  findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) filter.region_id = jwtPayload?.region?.id;
    if (!filter.region_id) throw new BadRequestException('region is not found');

    return this.maritalService.findAll(filter);
  }

  @Get(':id')
  findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    let region_id: number;

    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) region_id = jwtPayload?.region?.id;
    if (!region_id) throw new BadRequestException('region is not found');

    return this.maritalService.findOne(id, region_id);
  }

  @Patch(':id')
  update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string, @Body() dto: UpdateMaritalDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;
    if (!dto.region_id) throw new BadRequestException('region is not found');

    return this.maritalService.update(id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    let region_id: number;

    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) region_id = jwtPayload?.region?.id;
    if (!region_id) throw new BadRequestException('region is not found');

    return this.maritalService.remove(id, region_id);
  }
}
