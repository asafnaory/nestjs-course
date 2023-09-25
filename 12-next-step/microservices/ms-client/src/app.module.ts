import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3030,
        },
      },
      // {
      //   name: 'MATH_SERVICE',
      //   transport: Transport.REDIS,
      //   options: {
      //     host: 'localhost',
      //     port: 6379,
      //   },
      // },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
