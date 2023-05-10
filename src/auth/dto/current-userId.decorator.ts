import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserIdFromJwt = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp().getRequest();
    return ctx.user.userId;
  },
);
