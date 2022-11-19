// src/auth/auth.service.ts

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
  ) {}

  async signup(dto: AuthCredentialsDto): Promise<User> {
    const { email, password } = dto;

    const user = await this.usersModel.findOne({ email });
    if (user) {
      // user already exists
      throw new ConflictException('User with that email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log({ salt, hashedPassword });

    const newUser = await this.usersModel.create({
      email,
      password: hashedPassword,
    });

    return newUser;
  }

  async signin(dto: AuthCredentialsDto): Promise<string> {
    const { email, password } = dto;
    const user = await this.usersModel.findOne({ email });

    //if no user found...
    if (!user) {
      throw new UnauthorizedException('Wrong credentials...');
    }

    // check if the password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Wrong credentials...');
    }

    return 'OK';
  }
}
