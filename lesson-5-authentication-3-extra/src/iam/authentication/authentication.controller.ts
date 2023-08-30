import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthenticationService } from './authentication.service';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '@prisma/client';
import { Public } from '../decorators/public.decorator';
import { Response } from 'express';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) { }
  @Post('signup')
  @Public()
  signUp(@Body() signUpDto: AuthCredentialsDto) {
    return this.authService.signup(signUpDto);
  }

  @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  @Post('signin')
  @Public()
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: AuthCredentialsDto,
  ) {
    const {accessToken, refreshToken}  = await this.authService.signin(signInDto);
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });

  }

  @HttpCode(HttpStatus.OK) 
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-tokens')
  async refreshTokens(
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: User,
  ) {
    console.log(user);
    const {accessToken, refreshToken} =  await this.authService.refreshTokens(user.id);
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }

  @HttpCode(200)
  @Get('signout')
  async signOut(@GetUser() user: User, @Res() res: Response) {
    const updatedUser = await this.authService.removeUserRefreshToken(user.id);
    res.setHeader('Set-Cookie', this.authService.getSignOutCookies());
    return res.json(updatedUser);
  }

  @Get('/test')
  test(@GetUser() user: User): User {
    console.log(user);
    return user;
  }
}
