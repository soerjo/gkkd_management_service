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
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from 'src/modules/region/services/region.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly regionService: RegionService,
  ) {}

  @Post()
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
  async findAll(@Query() filterDto: FilterDto) {
    return {
      message: 'success',
      data: await this.adminService.getAll(filterDto),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'success',
      data: await this.adminService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') @UUIDParam() id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const regions = await this.regionService.getManyByIds(
      updateAdminDto.regions_ids,
    );

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

    updateAdminDto.regions = regions;
    return {
      message: 'success',
      data: await this.adminService.update(id, updateAdminDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      message: 'success',
      data: await this.adminService.remove(id),
    };
  }
}
