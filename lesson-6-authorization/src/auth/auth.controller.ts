import { User } from '.prisma/client';
import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetAgent } from './decorators/get-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserToAdminDto } from './dto/user-to-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @Public()
  async signup(@Body() dto: AuthCredentialsDto) {
    console.log(dto);
    return this.authService.signup(dto);
  }

  @Post('/signin')
  @Public()
  async signin(@Body() dto: AuthCredentialsDto) {
    console.log(dto);
    return this.authService.signin(dto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetAgent() user: User): User {
    console.log(user);
    return user;
  }

  //For testing only
  @Put('/basic-to-admin')
  async basicToAdmin(@Body() { id }: UserToAdminDto) {
    this.authService.userToAdmin(id);
  }
}
