import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { validatePassword } from 'src/utils/hashing.util';
import { AdminService } from 'src/modules/admin/services/admin.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
  ) {}

  @Post('login')
  async create(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.adminService.getByUsernameOrEmail(createAuthDto.usernameOrEmail);

    if (!user) throw new BadRequestException('username or email or password is not valid');

    if (!user.password && !user.temp_password) throw new BadRequestException('user is not valid');

    if (
      (user.password && !validatePassword(createAuthDto.password, user.password)) ||
      (user.temp_password && !validatePassword(createAuthDto.password, user.temp_password))
    )
      throw new BadRequestException('username or email or password is not valid');

    const result = this.authService.generateJwt(user);

    return result;
  }
}
