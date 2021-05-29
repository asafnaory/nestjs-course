import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { User } from '../auth/interfaces/user.interface';

@Injectable()
export class DbService {
  private readonly db:User[];

  constructor() {
    this.db = [
      {
        id: '1',
        email: 'initial@mail.com',
        password: 'Aa123456',
      },
    ];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(_.find(this.db, ['email', email]));
  }

  async getUserById(id: string): Promise<User | undefined> {
    return Promise.resolve(_.find(this.db, ['id', id]));
  }

  async createUser(user: User): Promise<User> {
    const newUser = {
      ...user,
      id: new Date().getTime().toString().slice(6),
    };
    this.db.push(newUser);
    return Promise.resolve(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return Promise.resolve(this.db);
  }
}
