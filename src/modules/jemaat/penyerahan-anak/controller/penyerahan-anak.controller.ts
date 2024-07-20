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
import { PenyerahanAnakService } from '../services/penyerahan-anak.service';
import { CreatePenyerahanAnakDto } from '../dto/create-penyerahan-anak.dto';
import { UpdatePenyerahanAnakDto } from '../dto/update-penyerahan-anak.dto';
import { FilterDto } from '../dto/filter.dto';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';

@ApiTags('Penyerahan Anak')
@Controller('penyerahan-anak')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
export class PenyerahanAnakController {
  constructor(private readonly penyerahanAnakService: PenyerahanAnakService) {}

  @Post()
  create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreatePenyerahanAnakDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;

    return this.penyerahanAnakService.create(dto);
  }

  @Get()
  findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN)
      filter.region_tree_id = filter.region_id ?? jwtPayload?.region?.id;
    return this.penyerahanAnakService.findAll(filter);
  }

  @Get(':id')
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    const data = await this.penyerahanAnakService.findOne(id);
    if (!data) throw new BadRequestException('data is not found!');
    return data;
  }

  @Patch(':id')
  update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string, @Body() dto: UpdatePenyerahanAnakDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;

    return this.penyerahanAnakService.update(id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    let region_id: number;
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) region_id = jwtPayload?.region?.id;

    return this.penyerahanAnakService.remove(id, region_id);
  }
}
