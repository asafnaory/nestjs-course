import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { IamModule } from './iam/iam.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [PlayersModule, TeamsModule, IamModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
