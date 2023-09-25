import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    console.log('AppService', this.configService.get("FOO"));
    
  } 

  getHello(): string {
    return 'Hello World!';
  }
}
