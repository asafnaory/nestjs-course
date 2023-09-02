import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { HttpError404Filter } from './filters/404-exception.filter';

@Module({
  imports: [PlayersModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpError404Filter,
    },
  ],
})
export class AppModule {}
