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
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';

import { FilterDto } from '../dto/filter.dto';
import { RegionService } from '../../../modules/region/services/region.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { Roles } from '../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../common/constant/role.constant';
import { RolesGuard } from '../../../common/guard/role.guard';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { CurrentUser } from '../../../common/decorator/jwt-payload.decorator';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { BotFilter } from '../dto/filter-bot.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly regionService: RegionService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: CreateAdminDto) {
    dto.region_id = dto.region_id ?? jwtPayload?.region?.id;
    const region = await this.regionService.getOneById(dto.region_id);
    if (!region) throw new BadRequestException('region is not found!');

    const isUsernameExist = await this.adminService.getByUsername(dto.username ?? dto.name.split(' ').join('_'));
    if (isUsernameExist) throw new BadRequestException('name or username already exist');

    const isEmailExist = await this.adminService.getByEmail(dto.email);
    if (isEmailExist) throw new BadRequestException('email already exist');

    dto.region = region;
    return await this.adminService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filterDto: FilterDto) {
    if (jwtPayload.role !== RoleEnum.ROLE_SYSTEMADMIN) filterDto.region_tree_id = jwtPayload?.region?.id;

    return await this.adminService.getAll(filterDto);
  }

  @Get('/phone/:phone_number')
  async validateUserByPhoneNumber(@Param('phone_number') phone_number: string, @Query() data: any) {
    const admin = await this.adminService.getByPhoneNumber(phone_number);
    if (!admin) throw new BadRequestException('admin is not found!');

    await this.adminService.validateUserPhoneNumber(admin.phone, data);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOne(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    const result = await this.adminService.findOne(id);
    if (!result) throw new BadRequestException('admin is not found!');

    return result;
  }

  @Patch('update-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updatePassword(@CurrentUser() jwtPayload: IJwtPayload, @Body() dto: UpdatePasswordDto) {
    const adminUser = await this.adminService.findOne(jwtPayload.id);
    if (!adminUser) throw new BadRequestException('admin is not found!');
    await this.adminService.updatePassword(jwtPayload.id, dto.new_password);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @Param('id') id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    if (jwtPayload.id === id) throw new ForbiddenException('can not update it self');

    if (!updateAdminDto.region_id) updateAdminDto.region_id = jwtPayload?.region?.id;
    const isUsernameExist = await this.adminService.getByUsername(updateAdminDto?.name);
    if (isUsernameExist && id != isUsernameExist.id && isUsernameExist.name === updateAdminDto.name)
      throw new BadRequestException('username already exist');

    const isEmailExist = await this.adminService.getByEmail(updateAdminDto?.email);
    if (isEmailExist && id != isEmailExist.id && isEmailExist.email === updateAdminDto.email)
      throw new BadRequestException('email already exist');

    let region;
    if (updateAdminDto.region_id) {
      region = await this.regionService.getOneById(updateAdminDto.region_id);
      updateAdminDto.region = region;
    }

    return await this.adminService.update(id, updateAdminDto, jwtPayload?.region?.id);
  }

  @Patch(':id/reset-password')
  @ApiBearerAuth()
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async resetPassword(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    if (jwtPayload.id === id) throw new ForbiddenException();

    await this.adminService.resetPassword(id, jwtPayload?.region?.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async remove(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    const user = await this.adminService.findOne(id, jwtPayload?.region?.id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.id === jwtPayload.id) throw new ForbiddenException();

    return await this.adminService.remove(id);
  }

  @Post('/restore/:id')
  @ApiBearerAuth()
  @Roles([RoleEnum.ROLE_SUPERADMIN, RoleEnum.ROLE_SYSTEMADMIN, RoleEnum.ROLE_SYSTEMADMIN])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async restore(@CurrentUser() jwtPayload: IJwtPayload, @Param('id') id: number) {
    const user = await this.adminService.findOne(id, jwtPayload?.region?.id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.id === jwtPayload.id) throw new ForbiddenException();

    return await this.adminService.restore(id);
  }
}
