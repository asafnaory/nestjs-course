import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
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
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
