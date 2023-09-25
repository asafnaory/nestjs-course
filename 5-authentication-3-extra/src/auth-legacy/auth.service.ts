import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as ms from 'ms';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtConstants } from './constants';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload, TokenCookie, UserTokens } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: AuthCredentialsDto): Promise<User> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      // user already exists
      throw new ConflictException('User with that email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return newUser;
  }
  async signin(dto: AuthCredentialsDto): Promise<UserTokens> {
    const { email, password } = dto;
    let user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    //if no user found...
    if (!user) {
      throw new UnauthorizedException('Wrong credentials...');
    }

    // check if the password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Wrong credentials...');
    }

    const accessTokenCookieDetails = await this.createAccessTokenCookie(
      user.id,
    );
    const refreshTokenCookieDetails = await this.createRefreshTokenCookie(
      user.id,
    );

    user = await this.setUserRefreshTokenIntoDb(
      refreshTokenCookieDetails.token,
      user.id,
    );

    return { user, accessTokenCookieDetails, refreshTokenCookieDetails };
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

    return {
      sameSite: 'strict',
      maxAge: accessExpirationInSeconds,
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

    return {
      sameSite: 'strict',
      maxAge: refreshExpirationInSeconds,
      token: refreshToken,
    };
  }

  async setUserRefreshTokenIntoDb(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
    return user;
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: string,
  ): Promise<User | false> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return false;
    const isMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    return isMatching ? user : false;
  }

  getSignOutCookies(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0 SameSite=Strict',
      'Refresh=; HttpOnly; Path=/; Max-Age=0 SameSite=Strict',
    ];
  }

  async removeUserRefreshToken(id: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        refreshToken: null,
      },
    });
  }
}
