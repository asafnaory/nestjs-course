import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

// const msOptions: MicroserviceOptions = {
//   transport: Transport.TCP,
//   options: {
//     host: '127.0.0.1',
//     port: 3030,
//   }
// }

const msOptions: MicroserviceOptions = {
transport: Transport.REDIS,
options: {
  url: 'redis://localhost:6379',
},
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, msOptions);
  app.listen(() => console.log(`Microservice is listening to redis...`));

}
bootstrap();


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();
