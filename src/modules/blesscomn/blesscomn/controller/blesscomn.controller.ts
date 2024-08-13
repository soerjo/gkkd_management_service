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
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BlesscomnService } from '../services/blesscomn.service';
import { CreateBlesscomnDto } from '../dto/create-blesscomn.dto';
import { UpdateBlesscomnDto } from '../dto/update-blesscomn.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FilterDto } from '../dto/filter.dto';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { CreateAdminBlesscomnDto } from '../dto/create-admin-blesscomn.dto';

@ApiTags('Blesscomn')
@Controller('blesscomn')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BlesscomnController {
  constructor(private readonly blesscomnService: BlesscomnService) {}

  @Patch('admin')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async createAdminBlesscom(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateAdminBlesscomnDto) {
    switch (jwtPayload.role) {
      case RoleEnum.ROLE_SYSTEMADMIN:
        break;

      case RoleEnum.ROLE_SUPERADMIN:
        dto.region_id = jwtPayload?.region?.id;
        break;

      default:
        throw new ForbiddenException();
    }

    return this.blesscomnService.createAdminBlesscomn(dto);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateBlesscomnDto) {
    switch (jwtPayload.role) {
      case RoleEnum.ROLE_SYSTEMADMIN:
        break;

      case RoleEnum.ROLE_SUPERADMIN:
        dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
        break;

      case RoleEnum.LEADER:
        dto.region_id = jwtPayload?.region?.id;
        dto.admin_id = jwtPayload.id;
        break;

      default:
        throw new ForbiddenException();
    }

    return this.blesscomnService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    switch (jwtPayload.role) {
      case RoleEnum.ROLE_SYSTEMADMIN:
        break;

      case RoleEnum.ROLE_SUPERADMIN:
        filter.region_tree_id = filter.region_id ?? jwtPayload?.region?.id;
        break;

      case RoleEnum.LEADER:
        filter.region_id = jwtPayload?.region?.id;
        filter.admin_id = jwtPayload.id;
        break;

      default:
        throw new ForbiddenException();
    }

    return this.blesscomnService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    const result = await this.blesscomnService.findOne(id);
    if (!result) throw new NotFoundException('blesscomn is not found!');

    return result;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number, @Body() dto: UpdateBlesscomnDto) {
    switch (jwtPayload.role) {
      case RoleEnum.ROLE_SYSTEMADMIN:
        break;

      case RoleEnum.ROLE_SUPERADMIN:
        dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
        break;

      case RoleEnum.LEADER:
        dto.region_id = jwtPayload?.region?.id;
        dto.admin_id = jwtPayload.id;
        break;

      default:
        throw new ForbiddenException();
    }

    await this.blesscomnService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    return this.blesscomnService.remove(id);
  }
}
