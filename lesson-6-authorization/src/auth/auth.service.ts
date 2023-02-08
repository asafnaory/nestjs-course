import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { handleErrors } from 'src/helpers/helpers';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: AuthCredentialsDto): Promise<User> {
    try {
      const { email, password } = dto;

      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        // user already exists
        throw new ConflictException('User with that email already exists');
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      console.log({ salt, hashedPassword });

      const newAgent = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return newAgent;
    } catch (e: unknown) {
      handleErrors(e);
    }
  }
  async signin(dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = dto;
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      //if no user found...
      if (!user) {
        throw new UnauthorizedException('Wrong credentials...');
      }

      // check if the password is valid
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new UnauthorizedException('Wrong credentials...');
      }

      const payload: JwtPayload = { id: user.id };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };

      // return 'OK';
    } catch (e: unknown) {
      handleErrors(e);
    }
  }

  // Only for testing...
  async userToAdmin(id): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: {
          id,
        },

        data: {
          role: Role.ADMIN,
        },
      });
    } catch (e: unknown) {
      handleErrors(e);
    }
  }
}
