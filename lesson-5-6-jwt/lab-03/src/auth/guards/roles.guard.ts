// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean | Promise<boolean> {
//     return true;
//   }
// }

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../interfaces/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log('RolesGuard required by route:', { requiredRoles });

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    console.log("User's request", { user });
    console.log('RolesGuard, user.roles:', user?.[ROLES_KEY]);
    const result = requiredRoles.some(role =>
      user?.[ROLES_KEY]?.includes(role),
    );
    console.log(`DEBUG guard: ${result}`);
    return result;
  }
}
