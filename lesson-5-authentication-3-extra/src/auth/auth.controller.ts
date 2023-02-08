import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Response } from 'express';
import JwtRefreshGuard from './jwt.refresh.guard';
import { User } from '@prisma/client';
import JwtAccessGuard from './guards/jwt.access.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() dto: AuthCredentialsDto) {
    return this.authService.signup(dto);
  }
  @Public()
  @Post('/signin')
  async signin(@Body() dto: AuthCredentialsDto, @Res() res: Response) {
    const { accessTokenCookieDetails, refreshTokenCookieDetails, user } =
      await this.authService.signin(dto);

    res.cookie('Authentication', accessTokenCookieDetails.token, {
      httpOnly: true,
      maxAge: accessTokenCookieDetails.maxAge,
      sameSite: accessTokenCookieDetails.sameSite,
    });
    res.cookie('Refresh', refreshTokenCookieDetails.token, {
      httpOnly: true,
      maxAge: refreshTokenCookieDetails.maxAge,
      sameSite: refreshTokenCookieDetails.sameSite,
    });

    console.log(user);
    return res.json(user);
  }
  // @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(@GetUser() user: User, @Res() res: Response) {
    console.log('refresh, user.id:', user.id);

    const { token, maxAge, sameSite } =
    await this.authService.createAccessTokenCookie(user.id);
    console.log('authentication, token:', token);
    res.cookie('Authentication', token, { httpOnly: true, maxAge, sameSite });

    return res.json(user);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/signout')
  @HttpCode(200)
  async signOut(@GetUser() user: User, @Res() res: Response) {
    const updatedUser = await this.authService.removeUserRefreshToken(user.id);
    res.setHeader('Set-Cookie', this.authService.getSignOutCookies());
    return res.json(updatedUser);
  }

  @Post('/test')
  @UseGuards(JwtAccessGuard)
  test(@GetUser() user: User): User {
    console.log(user);
    return user;
  }
}
