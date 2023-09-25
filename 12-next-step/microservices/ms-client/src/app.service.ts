// ms-rest-client/src/app.service.ts

import { Inject, Injectable } from '@nestjs/common';
import {
  // ClientProxyFactory,
  // Transport,
  ClientProxy,
} from '@nestjs/microservices';

@Injectable()
export class AppService {
  // private client: ClientProxy;

  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {
    // this.client = ClientProxyFactory.create({
    //   transport: Transport.TCP,
    //   options: {
    //     host: '127.0.0.1',
    //     port: 3030,
    //   },
    // });
  }

  async getHello() {
    console.log(`App service getHello()`);
    return await this.client.send<string>('hello', {});
  }
  async sum(data: number[]) {
    return await this.client.send<number, number[]>('sum', data);
  }

  async createUser(data: any) {
    this.client.emit('user_created', data);
  }
}
