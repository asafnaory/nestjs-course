// src/auth/auth.controller.ts

import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() dto: AuthCredentialsDto): Promise<string> {
    // console.log({ dto });
    return this.authService.signup(dto);
  }
  @Post('/signin')
  @HttpCode(200)
  async signin(
    @Body() dto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    // console.log({ dto });
    return this.authService.signin(dto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User): User {
    console.log(user);
    return user;
  }
}
