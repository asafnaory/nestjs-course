import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { Player, PlayerScheama } from './entities/player.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Player.name,
        schema: PlayerScheama
      }
    ])
  ],
  controllers: [PlayersController],
  providers: [PlayersService]
})
export class PlayersModule {}
