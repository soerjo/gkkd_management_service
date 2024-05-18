import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../constant/role.constant';
import { Roles } from '../decorator/role.decorator';
import { IJwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleEnum[]>(Roles, context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchRoles(roles, user.role, user);
  }

  matchRoles(roles: RoleEnum[], userRole: RoleEnum, payload: IJwtPayload) {
    let isValid = false;

    isValid = roles.some((role) => role === userRole);
    if (isValid) return true;

    return false;
  }
}
