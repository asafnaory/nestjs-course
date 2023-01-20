import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [PlayersModule, TeamsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
