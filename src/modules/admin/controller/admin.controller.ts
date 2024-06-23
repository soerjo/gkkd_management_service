import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  ForbiddenException,
  SerializeOptions,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';

import { FilterDto } from '../dto/filter.dto';
import { RegionService } from 'src/modules/region/services/region.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { RolesGuard } from 'src/common/guard/role.guard';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly regionService: RegionService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() createAdminDto: CreateAdminDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) createAdminDto.regions_id = jwtPayload?.region?.id;
    const region = await this.regionService.getOneById(createAdminDto.regions_id);

    const isUsernameExist = await this.adminService.getByUsername(createAdminDto.name);
    if (isUsernameExist) throw new BadRequestException('username already exist');

    const isEmailExist = await this.adminService.getByEmail(createAdminDto.email);
    if (isEmailExist) throw new BadRequestException('email already exist');

    createAdminDto.region = region;
    return await this.adminService.create(createAdminDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filterDto: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) filterDto.region_id = jwtPayload?.region?.id;

    return await this.adminService.getAll(filterDto);
  }

  @Get(':id')
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    const result = await this.adminService.findOne(id);
    if (!result) throw new BadRequestException('admin is not found!');

    return result;
  }

  @Patch('update-password')
  async updatePassword(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: UpdatePasswordDto) {
    const adminUser = await this.adminService.findOne(jwtPayload.id);
    if (!adminUser) throw new BadRequestException('admin is not found!');

    await this.adminService.updatePassword(jwtPayload.id, dto.new_password);

    // return { message: 'success' };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('id') id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) updateAdminDto.regions_id = jwtPayload?.region?.id;
    const isUsernameExist = await this.adminService.getByUsername(updateAdminDto?.name);
    if (isUsernameExist && id != isUsernameExist.id && isUsernameExist.name === updateAdminDto.name)
      throw new BadRequestException('username already exist');

    const isEmailExist = await this.adminService.getByEmail(updateAdminDto?.email);
    if (isEmailExist && id != isEmailExist.id && isEmailExist.email === updateAdminDto.email)
      throw new BadRequestException('email already exist');

    let region;
    if (updateAdminDto.regions_id) {
      region = await this.regionService.getOneById(updateAdminDto.regions_id);
      updateAdminDto.region = region;
    }

    return await this.adminService.update(id, updateAdminDto);
  }

  @Patch(':id/reset-password')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async resetPassword(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    const adminUser = await this.adminService.findOne(id, jwtPayload?.region?.id);
    if (!adminUser) throw new BadRequestException('admin is not found!');

    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN && adminUser.region.id !== jwtPayload?.region?.id)
      throw new BadRequestException('admin is not found!');

    await this.adminService.resetPassword(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  async remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    const user = await this.adminService.findOne(id, jwtPayload?.region?.id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.id === jwtPayload.id) throw new ForbiddenException();

    return await this.adminService.remove(id);
  }
}
