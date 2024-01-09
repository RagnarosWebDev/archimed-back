import { createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { TokenDto } from './token.dto';
import { destroyFields } from './shared.extension';

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as TokenDto | null | undefined;
  },
);

export const TypedBody = createParamDecorator(
  (data: Type<unknown>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return destroyFields(request.body, data);
  },
);
