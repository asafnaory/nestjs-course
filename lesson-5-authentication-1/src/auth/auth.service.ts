import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Agent } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
  async signin(dto: AuthCredentialsDto): Promise<string> {
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

    return 'OK';
  }
}
