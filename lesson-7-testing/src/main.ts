import { UseGuards, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/guards/auth.gaurd';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ValidationPipe: makes use class-validator package and its declarative validation decorators
  // app.useGlobalGuards(new (AuthGuard('jwt')));
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new AuthGuard(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      // implicitly transform query and path parameters based on the expected type.
      transform: true,
      // for more examples : https://docs.nestjs.com/techniques/validation
      transformOptions: {
        //If set to true class-transformer will attempt conversion based on TS reflected type
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
