import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import JwtAccessGuard from './auth/guards/jwt.access.guard';

@Module({
  imports: [PlayersModule, TeamsModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    // provide: APP_GUARD,
    // useClass: JwtAccessGuard,
    // },
  ],
})
export class AppModule {}
