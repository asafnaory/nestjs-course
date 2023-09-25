import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Agent } from '@prisma/client';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { jwtConstants } from './constants';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
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
