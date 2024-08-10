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
  ForbiddenException,
} from '@nestjs/common';
import { CreatePemuridanDto } from '../dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from '../dto/update-pemuridan.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { FilterDto } from '../dto/filter.dto';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { DisciplesService } from '../services/disciples.service';

@ApiTags('Pemuridan')
@Controller('pemuridan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DisciplesController {
  constructor(private readonly pemuridanService: DisciplesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SUPERADMIN, RoleEnum.DISCIPLES])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreatePemuridanDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');
      dto.pembimbing_id = parent.id;
    }

    if (!dto.region_id) throw new BadRequestException('region is not found!');

    return this.pemuridanService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SUPERADMIN, RoleEnum.DISCIPLES])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    filter.region_tree_id = filter.region_id ?? jwtPayload?.region?.id;
    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');
      filter.disciple_tree_id = parent.id;
      filter.pembimbing_id = filter.pembimbing_id ?? parent.id;
    }

    return this.pemuridanService.findAll(filter);
  }

  @Get('list')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SUPERADMIN, RoleEnum.DISCIPLES])
  async getListAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    filter.region_tree_id = filter.region_id ?? jwtPayload?.region?.id;
    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');
      filter.disciple_tree_id = parent.id;
    }

    return this.pemuridanService.getAllList(filter);
  }

  @Get(':nim')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async findOne(@Param('nim') nim: string) {
    const result = await this.pemuridanService.findOne(nim);
    if (!result) throw new BadRequestException('pemuridan is not found!');

    return result;
  }

  @Patch(':nim')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async update(@CurrentUser() jwtPayload: IJwtPayload, @Param('nim') nim: string, @Body() dto: UpdatePemuridanDto) {
    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');

      const murid = await this.pemuridanService.findOne(nim);
      if (!murid) throw new BadRequestException('disciples is not found');
      if (murid.pembimbing_id !== parent.id) throw new ForbiddenException('not the parent');
    }

    await this.pemuridanService.update(nim, dto);
  }

  @Delete(':nim')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async remove(@Param('nim') nim: string) {
    await this.pemuridanService.remove(nim);
  }
}
