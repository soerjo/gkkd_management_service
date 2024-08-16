import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { validatePassword } from '../../../utils/hashing.util';
import { AdminService } from '../../../modules/admin/services/admin.service';
import { BotService } from '../../bot/bot.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly botService: BotService,
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
    console.log({ user });

    const Region = String(user?.region?.name).toUpperCase() ?? 'E-GEREJA';
    if (user.telegram_user_id) {
      this.botService.sendMail({
        telegram_user_id: user.telegram_user_id,
        message: `
${Region}
Kami melihat adanya aktivitas login pada,
Akun: ${user.username}
Nama: ${user.name}
Role: ${user.role}
Tanggal: ${new Date().toLocaleDateString('id')}
        `,
      });
    }

    return result;
  }
}
