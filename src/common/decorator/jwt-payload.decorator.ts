import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../interface/jwt-payload.interface';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): IJwtPayload => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
