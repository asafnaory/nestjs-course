import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) { }
  @Post('signup')
  signUp(@Body() signUpDto: AuthCredentialsDto) {
    return this.authService.signup(signUpDto);
  }

  @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signInDto: AuthCredentialsDto,
  ) {
    return this.authService.signin(signInDto);
  }
}
