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
import { DisciplesGroupService } from '../services/disciples.service';

@ApiTags('Pemuridan')
@Controller('pemuridan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DisciplesGroupController {
  constructor(private readonly pemuridanService: DisciplesGroupService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.PARENT])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() createPemuridanDto: CreatePemuridanDto) {
    if (jwtPayload.jemaat_id) createPemuridanDto.lead_id = jwtPayload.jemaat_id;

    return {
      message: 'success',
      data: await this.pemuridanService.create(createPemuridanDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.PARENT])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.jemaat_id) filter.lead_id = jwtPayload.jemaat_id;

    return {
      message: 'success',
      data: await this.pemuridanService.findAll(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.PARENT])
  async findOne(@Param('id') id: number) {
    const result = await this.pemuridanService.findOne(id);
    if (!result) throw new BadRequestException('pemuridan is not found!');

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.PARENT])
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('id') id: number,
    @Body() updatePemuridanDto: UpdatePemuridanDto,
  ) {
    if (jwtPayload.jemaat_id) updatePemuridanDto.lead_id = jwtPayload.jemaat_id;

    return {
      message: 'success',
      data: await this.pemuridanService.update(id, updatePemuridanDto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async remove(@Param('id') id: number) {
    return {
      message: 'success',
      data: await this.pemuridanService.remove(id),
    };
  }
}
