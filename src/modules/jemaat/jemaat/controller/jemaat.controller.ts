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
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';

import { FilterDto } from '../dto/filter.dto';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';

@ApiTags('Jemaat')
@Controller('jemaat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class JemaatController {
  constructor(private readonly jemaatService: JemaatService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateJemaatDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;

    return await this.jemaatService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) filter.region_id = filter.region_id ?? jwtPayload?.region?.id;

    return await this.jemaatService.findAll(filter);
  }

  @Get(':nij')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('nij') nij: string) {
    const jemaat = await this.jemaatService.findOne(nij);
    if (!jemaat) throw new BadRequestException('jemaat is not found!');

    return jemaat;
  }

  @Patch(':nij')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
  async update(@CurrentUser() jwtPayload: IJwtPayload, @Param('nij') nij: string, @Body() dto: UpdateJemaatDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    return await this.jemaatService.update(nij, dto, jwtPayload?.region?.id);
  }

  @Delete(':nij')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('nij') nij: string) {
    let region_id: number;
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) region_id = jwtPayload?.region?.id;
    return await this.jemaatService.remove(nij, region_id);
  }
}
