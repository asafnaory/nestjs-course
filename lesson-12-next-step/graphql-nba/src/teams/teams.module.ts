import { forwardRef, Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './mongo-schema/team.schema';
import { Player, PlayerSchema } from 'src/players/mongo-schema/player.schema';
import { PlayersService } from 'src/players/players.service';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    // PlayersModule,
    forwardRef(() => PlayersModule)
  ],
  providers: [TeamsResolver, TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
