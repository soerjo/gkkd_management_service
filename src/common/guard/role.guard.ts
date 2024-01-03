import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../constant/role.constant';
import { Roles } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleEnum[]>(Roles, context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchRoles(roles, user.role);
  }

  matchRoles(roles: RoleEnum[], userRoles: RoleEnum[]) {
    let isValid = false;
    userRoles.forEach((userRole) => {
      isValid = roles.some((role) => role === userRole);
      return isValid;
    });

    return isValid;
  }
}
