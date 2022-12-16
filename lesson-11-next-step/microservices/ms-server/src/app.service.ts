import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Microservices!';
  }
  async sum(data: number[]): Promise<number> {
    return (data || []).reduce((a, b) => Number(a) + Number(b));
  }
}
