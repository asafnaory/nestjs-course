import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Agent } from '@prisma/client';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log(request?.cookies?.Authentication);
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: jwtConstants.ACCESS_TOKEN_SECRET,
    });
  }
  async validate(payload: JwtPayload): Promise<Agent> {
    const { id } = payload;
    const agent = await this.prismaService.agent.findUnique({
      where: {
        id,
      },
    });
    if (!agent) throw new UnauthorizedException();

    return agent;
  }
}
