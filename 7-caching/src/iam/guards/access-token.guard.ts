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
import { PrismaService } from 'src/prisma/prisma.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    if (this.isPublic(context)) return true

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          audience: jwtConstants.JWT_TOKEN_AUDIENCE,
          issuer: jwtConstants.JWT_TOKEN_ISSUER,
          secret: jwtConstants.JWT_SECRET,
          // ignoreExpiration: true
        },
      );
      const userRole = await this.getUserRole(payload.id)
      request[REQUEST_USER_KEY] = {...payload, role: userRole};
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
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
  private async getUserRole(id: string): Promise<string | null> {
    let userRole: string; 
    userRole = await this.cacheManager.get<string>(id);
    if(!userRole){
       const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          role: true, 
        },
      });
      userRole = user?.role;
    }
    return userRole ?? null;
  }
  
}
