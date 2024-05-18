import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../constant/role.constant';

export const Roles = Reflector.createDecorator<RoleEnum[]>();
