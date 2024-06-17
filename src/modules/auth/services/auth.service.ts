import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminEntity } from 'src/modules/admin/entities/admin.entity';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateJwt(user: AdminEntity) {
    const payload: IJwtPayload = {
      id: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
      region: user.region,
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
