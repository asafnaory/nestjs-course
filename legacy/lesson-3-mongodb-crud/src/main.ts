import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    // implicitly transform query and path parameters based on the expected type.
    transform: true,
    // for more examples : https://docs.nestjs.com/techniques/validation
    transformOptions: {
      //If set to true class-transformer will attempt conversion based on TS reflected type
      enableImplicitConversion: true,
    },
  }
  ));
  await app.listen(3000);
}
bootstrap();
