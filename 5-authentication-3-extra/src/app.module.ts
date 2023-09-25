import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { IamModule } from './iam/iam.module';
import { AccessTokenGuard } from './iam/guards/access-token.guard';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [PlayersModule, TeamsModule, IamModule, JwtModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
