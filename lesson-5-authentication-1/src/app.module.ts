import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [PlayersModule, TeamsModule, IamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
