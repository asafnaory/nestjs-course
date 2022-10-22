import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Agent, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: AuthCredentialsDto): Promise<Agent> {
    const { email, password } = dto;

    const agent = await this.prisma.agent.findUnique({
      where: {
        email,
      },
    });
    if (agent) {
      // agent already exists
      throw new ConflictException('User with that email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log({ salt, hashedPassword });

    const newAgent = await this.prisma.agent.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return newAgent;
  }
  async signin(dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, password } = dto;
    const agent = await this.prisma.agent.findUnique({
      where: {
        email,
      },
    });

    //if no agent found...
    if (!agent) {
      throw new UnauthorizedException('Wrong credentials...');
    }

    // check if the password is valid
    const validPassword = await bcrypt.compare(password, agent.password);
    if (!validPassword) {
      throw new UnauthorizedException('Wrong credentials...');
    }

    const payload: JwtPayload = { id: agent.id };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };

    // return 'OK';
  }

  async userToAdmin(id): Promise<Agent> {
    return await this.prisma.agent.update({
      where: {
        id,
      },

      data: {
        role: Role.ADMIN,
      },
    });
  }
}
