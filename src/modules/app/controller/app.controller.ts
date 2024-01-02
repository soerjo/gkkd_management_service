import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BooksEnum } from 'src/common/constant/books.constant';
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

  @Get('book')
  async getLovBooksEnum() {
    return {
      message: 'success',
      data: Object.values(BooksEnum),
    };
  }
}
