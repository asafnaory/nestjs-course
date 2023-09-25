// ms-rest-client/src/app.controller.ts

import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    console.log(`App Controller getHello()`);
    return await this.appService.getHello();
  }
  @Post('sum')
  async sum(@Body('data') data: number[]) {
    console.log({ data });
    return await this.appService.sum(data);
  }
  @Post('user')
  async createUser(@Body() data: any) {
    console.log('App Controller createUser()', { data });
    return await this.appService.createUser(data);
  }
}
