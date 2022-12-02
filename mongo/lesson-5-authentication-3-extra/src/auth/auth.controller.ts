// src/auth/auth.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';
import JwtRefreshGuard from './jwt.refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() dto: AuthCredentialsDto): Promise<string> {
    // console.log({ dto });
    return this.authService.signup(dto);
  }
  @Post('/signin')
  @HttpCode(200)
  async signin(
    @Body() dto: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<any> {
    // console.log({ dto });
    const { accessTokenCookie, refreshTokenCookie, user } =
      await this.authService.signin(dto);
    res.setHeader('Set-Cookie', [
      accessTokenCookie.cookie,
      refreshTokenCookie.cookie,
    ]);
    return res.json(user);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(@GetUser() user: User, @Res() res: Response) {
    const { cookie } = await this.authService.createAccessTokenCookie(user.id);

    res.setHeader('Set-Cookie', cookie);
    return res.json(user);
  }

  @UseGuards(AuthGuard())
  @Get('/signout')
  @HttpCode(200)
  async signOut(@GetUser() user: User, @Res() res: Response) {
    await this.authService.removeUserRefreshToken(user.id);
    res.setHeader('Set-Cookie', this.authService.getSignOutCookies());
    return res.json()
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User): User {
    console.log(user);
    return user;
  }
}
