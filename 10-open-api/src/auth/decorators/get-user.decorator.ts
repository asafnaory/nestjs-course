import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Agent } from '@prisma/client';


export const GetAgent = createParamDecorator(
  (data: any, ctx: ExecutionContext): Agent => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);