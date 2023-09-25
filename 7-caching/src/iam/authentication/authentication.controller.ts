import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthenticationService } from './authentication.service';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '@prisma/client';
import { Public } from '../decorators/public.decorator';
import { AccessTokenGuard } from '../guards/access-token.guard';

@Controller('authentication')
@Public()
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


  @Post('/test')
  @UseGuards(AccessTokenGuard)
  test(@GetUser() user: User): User {
    console.log(user);
    return user;
  }
}
