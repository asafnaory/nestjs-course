import { UseGuards, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

    const config = new DocumentBuilder()
    .setTitle('Players Teams example')
    .setDescription('The Players Teams API description')
    .setVersion('1.0')
    .addTag('Players Teams')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  
    await app.listen(3000)
}
bootstrap();
