import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { REQUEST_USER_KEY, jwtConstants } from '../authentication/consts';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          audience: jwtConstants.JWT_TOKEN_AUDIENCE,
          issuer: jwtConstants.JWT_TOKEN_ISSUER,
          secret: jwtConstants.REFRESH_JWT_SECRET,
          // ignoreExpiration: true
        },
      );
      request[REQUEST_USER_KEY] = payload;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.refreshToken; 
  }

  private isPublic(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'isPublic', [
      context.getHandler(),
      context.getClass()
    ]
    );

    if (isPublic) {
      return true;
    }
  }
}
