import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import * as Joi from 'joi';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().default(
          "postgresql://nestjs-course:pass123@localhost:5432/nest-course"
        ),
        FOO: Joi.string().valid('bar'),
        JWT_SECRET: Joi.string(),
        JWT_TOKEN_AUDIENCE: Joi.string(),
        JWT_TOKEN_ISSUER: Joi.string(),
        JWT_ACCESS_TOKEN_TTL: Joi.string(),
      }),
    }),
    PlayersModule,
    TeamsModule,
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
