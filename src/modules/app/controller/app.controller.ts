import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/constant/role.constant';

@ApiTags('LOV')
@Controller('lov')
export class LovControler {
  @Get('role')
  async getLovRoleEnum() {
    return {
      message: 'success',
      data: Object.values(RoleEnum),
    };
  }
}
