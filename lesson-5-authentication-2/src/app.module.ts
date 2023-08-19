import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { APP_GUARD } from '@nestjs/core';
import { IamModule } from './iam/iam.module';
import { AccessTokenGuard } from './iam/guards/access-token.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PlayersModule, TeamsModule, IamModule, JwtModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      // useClass: AuthGuard(),
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
