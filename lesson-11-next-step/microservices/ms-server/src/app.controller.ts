// micro-service/src/app.controller.ts

import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('hello')
  getHello(): string {
    console.log(`MS controller getHello()`);
    return this.appService.getHello();
  }

  @MessagePattern('sum')
  async sum(data: number[]): Promise<number> {
    console.log('Microservice - sum - ', { data });
    return this.appService.sum(data);
  }

  @EventPattern('user_created')
  async handleUserCreated(data: any): Promise<void> {
    console.log('Microservice - handleUserCreated - ', { data });
    // run other business logic here...
    // no need to return a response
  }
}
