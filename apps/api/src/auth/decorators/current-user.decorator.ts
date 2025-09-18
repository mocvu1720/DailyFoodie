import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: unknown }>();
    // Ensure user exists and is an object
    if (request && typeof request.user === 'object') {
      return request.user;
    }
    return null;
  },
);
