import { Agent } from '.prisma/client';
import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetAgent } from './decorators/get-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserToAdminDto } from './dto/user-to-admin.dto';

@ApiTags("auth")
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
  test(@GetAgent() agent: Agent): Agent {
    console.log(agent);
    return agent;
  }

  //For testing only
  @Put('/basic-to-admin')
  async basicToAdmin(@Body() { id }: UserToAdminDto) {
    this.authService.userToAdmin(id);
  }
}
