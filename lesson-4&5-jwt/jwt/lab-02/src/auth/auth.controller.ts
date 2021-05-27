import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() dto: AuthCredentialsDto): Promise<string>  {
    // console.log({ dto });
    return this.authService.signup(dto);
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() dto: AuthCredentialsDto): Promise<{ accessToken: string }>  {
    // console.log({ dto });
    return this.authService.signin(dto);
  }

  @Get('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(`/test - ${req.user}`);
    return req.user;
  }

  @Get('/test2')
  @UseGuards(AuthGuard())
  test2(@Req() req) {
    console.log(`/test2 - ${req.user}`);
    return req.user;
  }
}
