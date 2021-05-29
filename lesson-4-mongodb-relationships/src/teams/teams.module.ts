import { Player } from './../players/entities/player.entity';
import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from '../players/entities/player.entity';
import { Team, TeamSchema } from './entities/team.entity';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Player.name,
        schema: PlayerSchema
      },
      {
        name: Team.name,
        schema: TeamSchema
      },
    ])
  ],
  controllers: [TeamsController],
  providers: [TeamsService]
})
export class TeamsModule {}
