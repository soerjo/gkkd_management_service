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

import { FilterDto } from '../dto/filter.dto';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';

@ApiTags('Blesscomn')
@Controller('blesscomn')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BlesscomnController {
  constructor(private readonly blesscomnService: BlesscomnService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async create(@Body() createBlesscomnDto: CreateBlesscomnDto) {
    return {
      message: 'success',
      data: await this.blesscomnService.create(createBlesscomnDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SUPERADMIN) filter.region_id = jwtPayload?.region?.id;
    return await this.blesscomnService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async findOne(@Param('id') id: number) {
    const result = await this.blesscomnService.findOne(id);
    if (!result) throw new BadRequestException('blesscomn is not found!');

    return result;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.LEADER])
  async update(@Param('id') id: number, @Body() updateBlesscomnDto: UpdateBlesscomnDto) {
    return await this.blesscomnService.update(id, updateBlesscomnDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async remove(@Param('id') id: number) {
    return await this.blesscomnService.remove(id);
  }
}
