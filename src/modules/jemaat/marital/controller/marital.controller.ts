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
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { FilterDto } from '../dto/filter.dto';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { Roles } from '../../../../common/decorator/role.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';

@ApiTags('Marital')
@Controller('marital')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
export class MaritalController {
  constructor(private readonly maritalService: MaritalService) {}

  @Post()
  create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateMaritalDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    if (!dto.region_id) throw new BadRequestException('region is not found');

    return this.maritalService.create(dto);
  }

  @Get()
  findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN)
      filter.region_tree_id = filter.region_id ?? jwtPayload?.region?.id;

    return this.maritalService.findAll(filter);
  }

  @Get(':unique_code')
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('unique_code') unique_code: string) {
    const data = await this.maritalService.findOne(unique_code);
    if (!data) throw new BadRequestException('data is not found!');
    return data;
  }

  @Patch(':unique_code')
  update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('unique_code') unique_code: string,
    @Body() dto: UpdateMaritalDto,
  ) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    if (!dto.region_id) throw new BadRequestException('region is not found');

    return this.maritalService.update(unique_code, dto);
  }

  @Delete(':unique_code')
  remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('unique_code') unique_code: string) {
    return this.maritalService.remove(unique_code);
  }
}
