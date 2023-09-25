import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, TcpOptions, RedisOptions } from '@nestjs/microservices';

const msOptions: TcpOptions = {
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 3030,
  },
};

// const msOptions: RedisOptions = {
//   transport: Transport.REDIS,
//   options: {
//     host: 'localhost',
//     port: 6379,
//   },
// };

async function bootstrap() {
  const { host, port } = msOptions.options;
  const app = await NestFactory.createMicroservice(AppModule, msOptions);
  await app.listen();
  console.log(`Microservice is listening on ${host}:${port}`);
  // console.log(`Microservice is listening to redis`);
}
bootstrap();
