import { Agent } from '.prisma/client';
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
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetAgent } from './decorators/get-user.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Response } from 'express';
import JwtRefreshGuard from './jwt.refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() dto: AuthCredentialsDto) {
    return this.authService.signup(dto);
  }

  @Post('/signin')
  async signin(@Body() dto: AuthCredentialsDto, @Res() res: Response) {
    const { accessTokenCookie, refreshTokenCookie, agent } =
      await this.authService.signin(dto);

    res.setHeader('Set-Cookie', [
      accessTokenCookie.cookie,
      refreshTokenCookie.cookie,
    ]);
    
    return res.json(agent);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(@GetAgent() user: Agent, @Res() res: Response) {
    console.log('refresh, user.id:', user.id);

    const { cookie } = await this.authService.createAccessTokenCookie(user.id);
    console.log('refresh, cookie:', cookie);
    res.setHeader('Set-Cookie', cookie);

    return res.json(user);
  }

  @UseGuards(AuthGuard())
  @Get('/signout')
  @HttpCode(200)
  async signOut(@GetAgent() user: Agent, @Res() res: Response) {
    await this.authService.removeUserRefreshToken(user.id);
    res.setHeader('Set-Cookie', this.authService.getSignOutCookies());
    return;
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetAgent() agent: Agent): Agent {
    console.log(agent);
    return agent;
  }
}
