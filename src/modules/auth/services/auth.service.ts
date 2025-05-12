import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminEntity } from '../../../modules/admin/entities/admin.entity';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateJwt(user: AdminEntity) {
    const payload: IJwtPayload = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      region_id: user.region?.id,
      region: user.region,
      tempPassword: user.temp_password ? true : false,
      isPhoneValidate: user.telegram_user_id ? true : false,
    };
    const jwt = this.jwtService.sign(payload);

    return { payload, jwt };
  }

  decodeJwt(jwt: string) {
    return this.jwtService.verify(jwt, {
      secret: this.configService.get('JWT_SECRET_KEY'),
    });
  }
}
