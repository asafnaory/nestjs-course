import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DbService } from 'src/db/db.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly dbService: DbService) {}

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

  @Get('/user')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    // console.log(`/user - ${req.user}`);
    return req.user;
  }

  @Get('/users')
  @UseGuards(AuthGuard())
  test2(@Req() req) {
     return this.dbService.getAllUsers()
  }
}
