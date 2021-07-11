import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
export interface User {
  email: string;
  password: string;
  id?: string;
}

@Injectable()
export class DbService {
  private readonly db;

  constructor() {
    this.db = [
      {
        id: 1,
        email: 'initial@mail.com',
        password: 'Aa123456',
      },
    ];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(_.find(this.db, ['email', email]));
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
}
