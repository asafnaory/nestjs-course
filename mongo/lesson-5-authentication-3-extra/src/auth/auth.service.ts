import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  TokenCookie,
  UserTokens,
} from './interfaces/jwt-payload.interface';
import * as ms from 'ms';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  //   console.log('service signup', dto);
  async signup(dto: AuthCredentialsDto): Promise<string> {
    const { email, password } = dto;

    const user = await this.usersModel.findOne({ email });
    if (user) {
      // user already exists
      throw new ConflictException('User with that email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log({ salt, hashedPassword });

    const newUser = await this.usersModel.create({
      email,
      password: hashedPassword,
    });
    return newUser.id;
  }

  async signin(dto: AuthCredentialsDto): Promise<UserTokens> {
    const { email, password } = dto;
    let user = await this.usersModel.findOne({ email });
    //if no user found...
    if (!user) {
      throw new UnauthorizedException('Wrong credentials...');
    }
    // check if the password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Wrong credentials...');
    }

    const accessTokenCookie = await this.createAccessTokenCookie(user.id);
    const refreshTokenCookie = await this.createRefreshTokenCookie(user.id);

    user = await this.setUserRefreshToken(refreshTokenCookie.token, user.id);

    return { user, accessTokenCookie, refreshTokenCookie };
  }

  async createAccessTokenCookie(userId: string): Promise<TokenCookie> {
    const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION_TIME } = jwtConstants;
    const payload: JwtPayload = { id: userId };
    const accessToken = await this.jwtService.sign(payload, {
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
    });
    const accessExpirationInSeconds = ms(ACCESS_TOKEN_EXPIRATION_TIME) * 1000;
    const accessTokenCookie = `Authentication=${accessToken};HttpOnly;Path=/;Max-Age=${accessExpirationInSeconds};SameSite=Strict;`;
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
    const refreshTokenCookie = `Refresh=${refreshToken};HttpOnly;Path=/;Max-Age=${refreshExpirationInSeconds};SameSite=Strict;`;
    return {
      cookie: refreshTokenCookie,
      token: refreshToken,
    };
  }

  async setUserRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<User & { _id: ObjectId }> {
    const salt = await bcrypt.genSalt();
    const hashRefreshToken = await bcrypt.hash(refreshToken, salt);

    const user = await this.usersModel.findByIdAndUpdate(
      userId,
      { refreshToken: hashRefreshToken },
      { new: true },
    );
    return user;
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<User | false> {
    const user = await this.usersModel.findById(userId);
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

  async removeUserRefreshToken(userId: string): Promise<void> {
    await this.usersModel.findByIdAndUpdate(userId, { refreshToken: null });
  }
}
