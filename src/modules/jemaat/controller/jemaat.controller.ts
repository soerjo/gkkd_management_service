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
import { JemaatService } from '../services/jemaat.service';
import { CreateJemaatDto } from '../dto/create-jemaat.dto';
import { UpdateJemaatDto } from '../dto/update-jemaat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';
import { RoleEnum } from 'src/common/constant/role.constant';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';

@ApiTags('Jemaat')
@Controller('jemaat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class JemaatController {
  constructor(private readonly jemaatService: JemaatService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async create(@CurrentUser() jwtPayload: IJwtPayload, @Body() createJemaatDto: CreateJemaatDto) {
    if (jwtPayload?.regions?.length) createJemaatDto.region_id = jwtPayload.regions[0].id;

    return {
      message: 'success',
      data: await this.jemaatService.create(createJemaatDto),
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async findAll(@CurrentUser() jwtPayload: IJwtPayload, @Query() filter: FilterDto) {
    if (jwtPayload?.regions?.length) filter.region_id = jwtPayload.regions[0].id;

    return {
      message: 'success',
      data: await this.jemaatService.findAll(filter),
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async findOne(@UUIDParam() @Param('id') id: string) {
    const result = await this.jemaatService.findOne(id);
    if (!result) throw new BadRequestException({ message: 'result is not found!' });

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  async update(
    @CurrentUser() jwtPayload: IJwtPayload,
    @UUIDParam() @Param('id') id: string,
    @Body() updateJemaatDto: UpdateJemaatDto,
  ) {
    if (jwtPayload?.regions?.length) updateJemaatDto.region_id = jwtPayload.regions[0].id;

    return {
      message: 'success',
      data: await this.jemaatService.update(id, updateJemaatDto),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleEnum.SUPERADMIN])
  async remove(@UUIDParam() @Param('id') id: string) {
    return {
      message: 'success',
      data: await this.jemaatService.remove(id),
    };
  }
}
