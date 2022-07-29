import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
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
}
