import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DbService } from 'src/db/db.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './interfaces/roles.enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly dbService: DbService,
  ) {}

  @Post('/signup')
  async signup(@Body() dto: AuthCredentialsDto): Promise<string> {
    console.log({ dto });
    return this.authService.signup(dto);
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(
    @Body() dto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    console.log({ dto });
    return this.authService.signin(dto);
  }

  @Get('/user')
  @UseGuards(AuthGuard(), RolesGuard) // AuthGuard() is the default of AuthGuard('jwt')
  @Roles(UserRole.USER)
  getUser(@Req() req, @Body('role') role: UserRole) {
    console.log(`/user - ${JSON.stringify(req.user)}`);
    console.log({ role });
    return req.user;
  }

  @Get('/users')
  @UseGuards(AuthGuard(), RolesGuard) // AuthGuard() is the default of AuthGuard('jwt')
  @Roles(UserRole.ADMIN)
  getAllUsers(@Body('role') role: UserRole) {
    console.log({ role });
    return this.dbService.getAllUsers();
  }
}
