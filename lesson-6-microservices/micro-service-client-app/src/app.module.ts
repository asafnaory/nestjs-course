import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      // {
      //   name: 'MATH_SERVICE',
      //   transport: Transport.TCP,
      //   options:{
      //     host:'127.0.0.1',
      //     port: 3030
      //   }
      // }
      {
        name: 'MATH_SERVICE', 
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379'
        }

      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
