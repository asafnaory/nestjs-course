import { Agent } from '.prisma/client';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetAgent } from './decorators/get-user.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() dto: AuthCredentialsDto) {
    console.log(dto);
    return this.authService.signup(dto);
  }

  @Post('/signin')
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
}
