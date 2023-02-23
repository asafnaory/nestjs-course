import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().default(
          'postgresql://asafna:postgres@localhost:5432/nestjs-course',
        ),
        FOO: Joi.string().valid('bar'),
        SECRET: Joi.string(),
        EXPIRES_IN: Joi.string(),
        IGNORE_EXPIRATION: Joi.string().valid('true', 'false'),
      }),
    }),
    PlayersModule,
    TeamsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
