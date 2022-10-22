import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface';
import { Agent } from '@prisma/client';


@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: jwtConstants.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<Agent> {
    const refreshToken = request.cookies?.Refresh;
    const agent = await this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
    if (!agent) throw new UnauthorizedException();
    return agent;
  }
}