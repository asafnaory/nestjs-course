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
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRole } from './roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  //   console.log('service signup', dto);
  async signup(dto: AuthCredentialsDto): Promise<string> {
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
    return newUser.id;
  }

  async signin(dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
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

    const payload: JwtPayload = { id: user.id };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
    // return 'OK';
  }

  async assignRole(userId: string, role: UserRole): Promise<User> {
    const user = await this.usersModel.findByIdAndUpdate(
      userId,
      { $addToSet: { roles: role } },
      { new: true },
    );
    return user;
  }
  
  async revokeRole(userId: string, role: UserRole): Promise<User> {
    const user = await this.usersModel.findByIdAndUpdate(
      userId,
      { $pull: { roles: role } },
      { new: true },
    );
    return user;
  }

}