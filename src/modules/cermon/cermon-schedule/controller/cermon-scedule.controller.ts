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
  Query,
} from '@nestjs/common';
import { JadwalIbadahService } from '../services/jadwal-ibadah.service';
import { CreateJadwalIbadahDto } from '../dto/create-jadwal-ibadah.dto';
import { UpdateJadwalIbadahDto } from '../dto/update-jadwal-ibadah.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { Roles } from '../../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { FilterJadwalIbadahDto } from '../dto/filter.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@ApiTags('Cermon')
@Controller('cermon')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_ADMIN])
export class JadwalIbadahController {
  constructor(private readonly jadwalIbadahService: JadwalIbadahService) {}

  @Post()
  create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateJadwalIbadahDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    if (!dto.region_id) throw new BadRequestException('region is not found!');

    return this.jadwalIbadahService.create(dto);
  }

  @Get()
  findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() dto: FilterJadwalIbadahDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    return this.jadwalIbadahService.findAll(dto);
  }

  @Get(':id')
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    const cermon = await this.jadwalIbadahService.findOne(+id, jwtPayload?.region?.id);
    if (!cermon) throw new BadRequestException('cermon is not found!');
    console.log({ cermon });
    return cermon;
  }

  @Patch(':id')
  update(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string, @Body() dto: UpdateJadwalIbadahDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) dto.region_id = jwtPayload?.region?.id;
    if (!dto.region_id) throw new BadRequestException('region is not found!');

    return this.jadwalIbadahService.update(+id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: string) {
    return this.jadwalIbadahService.remove(+id, jwtPayload?.region?.id);
  }
}
