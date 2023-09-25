import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';


export const GetAgent = createParamDecorator(
  (data: any, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);