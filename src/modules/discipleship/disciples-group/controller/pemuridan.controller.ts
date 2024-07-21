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
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { FilterDto } from '../dto/filter.dto';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { DisciplesGroupService } from '../services/disciples.service';
import { DisciplesService } from '../../disciples/services/disciples.service';

@ApiTags('Pemuridan')
@Controller('group/pemuridan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DisciplesGroupController {
  constructor(
    private readonly pemuridanGroupService: DisciplesGroupService,
    private readonly pemuridanService: DisciplesService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateGroupDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;

    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');
      dto.pembimbing_nim = parent.nim;
    }

    if (!dto.region_id) throw new BadRequestException('region is not found!');
    if (!dto.pembimbing_nim) throw new BadRequestException('pembimbing is not found!');

    return this.pemuridanGroupService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    filter.region_tree_id = filter.region_id ?? jwtPayload?.region?.id;
    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');
      filter.pembimbing_nim = parent.nim;
    }

    return this.pemuridanGroupService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async findOne(@Param('id') id: number) {
    const result = await this.pemuridanGroupService.findOne(id);
    if (!result) throw new BadRequestException('pemuridan is not found!');

    return result;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.DISCIPLES])
  async update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number, @Body() dto: UpdateGroupDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;

    if (jwtPayload.role === RoleEnum.DISCIPLES) {
      const parent = await this.pemuridanService.getAccountDisciple(jwtPayload.id);
      if (!parent) throw new BadRequestException('user account is not found!');
      dto.pembimbing_nim = parent.nim;
    }

    if (!dto.region_id) throw new BadRequestException('region is not found!');
    if (!dto.pembimbing_nim) throw new BadRequestException('pembimbing is not found!');

    return this.pemuridanGroupService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async remove(@Param('id') id: number) {
    await this.pemuridanGroupService.remove(id);
  }
}
