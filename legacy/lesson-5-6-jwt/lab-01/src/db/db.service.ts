import { Injectable } from '@nestjs/common';
import { find }from 'lodash';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/interfaces/user.interface';

@Injectable()
export class DbService {
  private db: User[];

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    const password = await this.hashPasswordForFirstUser();
    this.db = [
      {
        id: '1',
        email: 'initial@mail.com',
        password,
      },
    ];
  }
  
  async hashPasswordForFirstUser(): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash('Aa123456', salt);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(find(this.db, ['email', email]));
  }

  async getUserById(id: string): Promise<User | undefined> {
    return Promise.resolve(find(this.db, ['id', id]));
  }

  async createUser(user: User): Promise<User> {
    const newUser = {
      ...user,
      id: new Date()
        .getTime()
        .toString()
        .slice(6),
    };
    this.db.push(newUser);
    return Promise.resolve(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return Promise.resolve(this.db);
  }
}
