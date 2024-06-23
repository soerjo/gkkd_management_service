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
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { FilterDto } from '../dto/filter.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';

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
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;

    return this.baptisanService.create(dto);
  }

  @Get()
  findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) filter.region_id = jwtPayload?.region?.id;

    return this.baptisanService.findAll(filter);
  }

  @Get(':id')
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    let region_id: number;
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) region_id = jwtPayload?.region?.id;
    if (region_id) throw new BadRequestException('region is not found ');

    const baptism = await this.baptisanService.findOne(id, region_id);
    return baptism;
  }

  @Patch(':id')
  async update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string, @Body() dto: UpdateBaptisanDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;

    const baptismRecord = await this.baptisanService.findOne(id, dto.region_id);
    if (!baptismRecord) throw new BadRequestException('baptism record is not found');

    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN && baptismRecord.jemaat.region_id !== jwtPayload.region.id) {
      throw new ForbiddenException();
    }

    return this.baptisanService.update(id, dto);
  }

  @Delete(':id')
  async remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    let region_id: number;
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) region_id = jwtPayload?.region?.id;

    const baptismRecord = await this.baptisanService.findOne(id, region_id);
    if (!baptismRecord) throw new BadRequestException('baptism record is not found');

    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN && baptismRecord.jemaat.region_id !== jwtPayload.region.id) {
      throw new ForbiddenException();
    }
    return this.baptisanService.remove(id, region_id);
  }
}
