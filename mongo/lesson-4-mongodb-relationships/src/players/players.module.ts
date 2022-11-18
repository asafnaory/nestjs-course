import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { Player, PlayerSchema } from './entities/player.entity';
import { Team, TeamSchema } from 'src/teams/entities/team.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Player.name,
        schema: PlayerSchema,
      },
      {
        name: Team.name,
        schema: TeamSchema,
      },
    ]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
