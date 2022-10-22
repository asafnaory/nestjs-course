import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Agent } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, TokenCookie, UserTokens } from './jwt-payload.interface';
import { jwtConstants } from './constants';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: AuthCredentialsDto): Promise<Agent> {
    const { email, password } = dto;

    const agent = await this.prisma.agent.findUnique({
      where: {
        email,
      },
    });
    if (agent) {
      // agent already exists
      throw new ConflictException('User with that email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAgent = await this.prisma.agent.create({
      data: {
        email,
        password: hashedPassword
      },
    });

    return newAgent;
  }
  async signin(dto: AuthCredentialsDto): Promise<UserTokens> {
    const { email, password } = dto;
    let agent = await this.prisma.agent.findUnique({
      where: {
        email,
      },
    });

    //if no agent found...
    if (!agent) {
      throw new UnauthorizedException('Wrong credentials...');
    }

    // check if the password is valid
    const validPassword = await bcrypt.compare(password, agent.password);
    if (!validPassword) {
      throw new UnauthorizedException('Wrong credentials...');
    }

    const accessTokenCookie = await this.createAccessTokenCookie(agent.id);
    const refreshTokenCookie = await this.createRefreshTokenCookie(agent.id);

    agent = await this.setUserRefreshTokenIntoDb(refreshTokenCookie.token, agent.id);

    return { agent, accessTokenCookie, refreshTokenCookie };
  }

  async createAccessTokenCookie(userId: string): Promise<TokenCookie> {
    const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION_TIME } = jwtConstants;
    const payload: JwtPayload = { id: userId };
    const accessToken = await this.jwtService.sign(payload, {
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
    });
    //Max-Age is in seconds...
    const accessExpirationInSeconds = ms(ACCESS_TOKEN_EXPIRATION_TIME) * 1000;
    const accessTokenCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${accessExpirationInSeconds} SameSite=Strict`;

    return {
      cookie: accessTokenCookie,
      token: accessToken,
    };
  }

  async createRefreshTokenCookie(userId: string): Promise<TokenCookie> {
    const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION_TIME } =
      jwtConstants;
    
      const payload: JwtPayload = { id: userId };

    const refreshToken = await this.jwtService.sign(payload, {
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    });
    const refreshExpirationInSeconds = ms(REFRESH_TOKEN_EXPIRATION_TIME) * 1000;
    const refreshTokenCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${refreshExpirationInSeconds} SameSite=Strict`;

    return {
      cookie: refreshTokenCookie,
      token: refreshToken,
    };
  }

  async setUserRefreshTokenIntoDb(
    refreshToken: string,
    userId: string,
  ): Promise<Agent> {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    const agent = await this.prisma.agent.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
    return agent;
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: string,
  ): Promise<Agent | false> {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) return false;
    const isMatching = await bcrypt.compare(refreshToken, agent.refreshToken);
    return isMatching ? agent : false;
  }

  getSignOutCookies(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0 SameSite=Strict',
      'Refresh=; HttpOnly; Path=/; Max-Age=0 SameSite=Strict',
    ];
  }

  async removeUserRefreshToken(id: string): Promise<void> {
    await this.prisma.agent.update({
      where: { id },
      data: {
        refreshToken: null,
      },
    });
  }
}
