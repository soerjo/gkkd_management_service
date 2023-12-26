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
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from 'src/modules/region/services/region.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { RolesGuard } from 'src/common/guard/role.guard';

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
  @Roles([RoleEnum.SUPERADMIN])
  async create(@Body() createAdminDto: CreateAdminDto) {
    const regions = await this.regionService.getManyByIds(
      createAdminDto.regions_ids,
    );

    const isUsernameExist = await this.adminService.getByUsername(
      createAdminDto.name,
    );
    if (isUsernameExist)
      throw new BadRequestException({ message: 'username already exist' });

    const isEmailExist = await this.adminService.getByEmail(
      createAdminDto.email,
    );
    if (isEmailExist)
      throw new BadRequestException({ message: 'email already exist' });

    createAdminDto.regions = regions;
    return {
      message: 'success',
      data: await this.adminService.create(createAdminDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN])
  async findAll(@Query() filterDto: FilterDto) {
    return {
      message: 'success',
      data: await this.adminService.getAll(filterDto),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.adminService.findOne(id);
    if (!result)
      throw new BadRequestException({ message: 'admin is not found!' });

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN])
  async update(
    @Param('id') @UUIDParam() id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const isUsernameExist = await this.adminService.getByUsername(
      updateAdminDto?.name,
    );
    if (isUsernameExist && id != isUsernameExist.id)
      throw new BadRequestException({ message: 'username already exist' });

    const isEmailExist = await this.adminService.getByEmail(
      updateAdminDto?.email,
    );
    if (isEmailExist && id != isEmailExist.id)
      throw new BadRequestException({ message: 'email already exist' });

    let regions;
    if (updateAdminDto.regions_ids) {
      regions = await this.regionService.getManyByIds(
        updateAdminDto.regions_ids,
      );
      updateAdminDto.regions = regions;
    }

    return {
      message: 'success',
      data: await this.adminService.update(id, updateAdminDto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN])
  async remove(@Param('id') id: string) {
    return {
      message: 'success',
      data: await this.adminService.remove(id),
    };
  }
}
