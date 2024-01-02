import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminEntity } from 'src/modules/admin/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateJwt(user: AdminEntity) {
    const payload = {
      username: user.name,
      email: user.email,
      role: user.role,
      regions: user.regions,
    };
    const jwt = this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_KEY'),
    });

    return { payload, jwt };
  }

  decodeJwt(jwt: string) {
    return this.jwtService.verify(jwt, {
      secret: this.configService.get('SECRET_KEY'),
    });
  }
}
