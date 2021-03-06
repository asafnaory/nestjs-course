import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
// bcrypt is a password-hashing function
import * as bcrypt from 'bcryptjs';
import { DbService } from '../db/db.service';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DbService) {}

  async signup(dto: AuthCredentialsDto): Promise<User> {
    const { email, password } = dto;

    const user = await this.dbService.getUserByEmail(email);
    if (user) {
      // user already exists
      throw new ConflictException('User with that email already exists');
    }

    // generate a salt and hash on separate function calls
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log({ salt, hashedPassword });

    return await this.dbService.createUser({
      email,
      password: hashedPassword,
    });
  }

  async signin(dto: AuthCredentialsDto): Promise<string> {
    const { email, password } = dto;
    const user = await this.dbService.getUserByEmail(email);

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
