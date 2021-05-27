import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('hello')
  getHello(): string {
    console.log('MS controller getHello()');
    return this.appService.getHello();
  }

  @MessagePattern('sum')
  async sum(data: number[]): Promise<number> {
    console.log('Microservice - sum - ', {data});
    return this.appService.sum(data);
  }

  @EventPattern('user_created')
  async handleUserCreated(data: any): Promise<void> {
    console.log('Microservice - handleUserCreated - ', { data });
    // run other business logic statments here...
    // no need to return a response
  }
}
