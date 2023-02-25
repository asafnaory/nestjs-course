import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from 'src/teams/mongo-schema/team.schema';
import { TeamsModule } from 'src/teams/teams.module';
import { TeamsService } from 'src/teams/teams.service';
import { Player, PlayerSchema } from './mongo-schema/player.schema';
import { PlayersResolver } from './players.resolver';
import { PlayersService } from './players.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    TeamsModule
  ],
  providers: [PlayersResolver, PlayersService],
  exports:[PlayersService]
})
export class PlayersModule {}
