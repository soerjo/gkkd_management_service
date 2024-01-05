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
import { PemuridanService } from '../services/pemuridan.service';
import { CreatePemuridanDto } from '../dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from '../dto/update-pemuridan.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { FilterDto } from '../dto/filter.dto';
import { RoleEnum } from 'src/common/constant/role.constant';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';

@ApiTags('Pemuridan')
@Controller('pemuridan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PemuridanController {
  constructor(private readonly pemuridanService: PemuridanService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() createPemuridanDto: CreatePemuridanDto) {
    if (jwtPayload.jemaat_id) createPemuridanDto.lead_id = jwtPayload.jemaat_id;

    return {
      message: 'success',
      data: await this.pemuridanService.create(createPemuridanDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    filter.lead_id = jwtPayload.jemaat_id;

    return {
      message: 'success',
      data: await this.pemuridanService.findAll(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async findOne(@Param('id') id: string) {
    const result = await this.pemuridanService.findOne(id);
    if (!result) throw new BadRequestException({ message: 'pemuridan is not found!' });

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.PEMBIMBING])
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('id') id: string,
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
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async remove(@Param('id') id: string) {
    return {
      message: 'success',
      data: await this.pemuridanService.remove(id),
    };
  }
}
