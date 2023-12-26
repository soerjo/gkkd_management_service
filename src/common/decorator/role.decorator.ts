import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../constant/role.constant';
import { SetMetadata } from '@nestjs/common';

export const Roles = Reflector.createDecorator<RoleEnum[]>();
