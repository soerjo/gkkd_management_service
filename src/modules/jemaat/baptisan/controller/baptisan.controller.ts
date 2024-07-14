import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { BaptisanService } from '../services/baptisan.service';
import { CreateBaptisanDto } from '../dto/create-baptisan.dto';
import { UpdateBaptisanDto } from '../dto/update-baptisan.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { FilterDto } from '../dto/filter.dto';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RolesGuard } from '../../../../common/guard/role.guard';

@ApiTags('Baptisan')
@Controller('baptisan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
export class BaptisanController {
  constructor(private readonly baptisanService: BaptisanService) {}

  @Post()
  create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateBaptisanDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = dto.region_id ?? jwtPayload?.region?.id;

    return this.baptisanService.create(dto);
  }

  @Get()
  findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) filter.region_id = filter.region_id ?? jwtPayload?.region?.id;
    return this.baptisanService.findAll(filter);
  }

  @Get(':uniq_code')
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('uniq_code') uniq_code: string) {
    const data = await this.baptisanService.findOne(uniq_code);
    if (!data) throw new BadRequestException('data is not found!');
    return data;
  }

  @Patch(':uniq_code')
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('uniq_code') uniq_code: string,
    @Body() dto: UpdateBaptisanDto,
  ) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = dto.region_id ?? jwtPayload?.region?.id;

    const baptismRecord = await this.baptisanService.findOne(uniq_code);
    if (!baptismRecord) throw new BadRequestException('baptism record is not found');

    return this.baptisanService.update(uniq_code, dto, jwtPayload?.region?.id);
  }

  @Delete(':uniq_code')
  async remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('uniq_code') uniq_code: string) {
    let region_id: number;
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) region_id = jwtPayload?.region?.id;

    const baptismRecord = await this.baptisanService.findOne(uniq_code);
    if (!baptismRecord) throw new BadRequestException('baptism record is not found');

    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN && baptismRecord.jemaat.region_id !== jwtPayload.region.id) {
      throw new ForbiddenException();
    }

    return this.baptisanService.remove(uniq_code, region_id);
  }
}
