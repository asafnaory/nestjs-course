import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [PlayersModule, TeamsModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
