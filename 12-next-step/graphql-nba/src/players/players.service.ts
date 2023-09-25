import { Model } from 'mongoose';
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { Player, PlayerDocument } from './mongo-schema/player.schema';
import { PlayerType } from './entities/player.type';
import { CreatePlayerInput } from './dto/create-player.input';
import { TeamsService } from 'src/teams/teams.service';
import { UpdatePlayerInput } from './dto/update-player.input';

@Injectable()
export class PlayersService {
  constructor(
    @Inject(forwardRef(() => TeamsService))
    private teamService: TeamsService,
    @InjectModel(Player.name) private playersModel: Model<PlayerDocument>,
  ) {}

  async getAllPlayers(): Promise<PlayerType[]> {
    return await this.playersModel.find();
  }

  async getPlayerById(id: string) {
    const player = await this.playersModel.findOne({ id });
    if (!player) {
      throw new NotFoundException('player does not exist');
    }
    return player;
  }

  async createPlayer(createPlayerInput: CreatePlayerInput) {
    const player = await this.playersModel.findOne({
      name: createPlayerInput.name,
    });
    if (player) {
      throw new ConflictException('Player already exists');
    }
    return await this.playersModel.create({ id: uuid(), ...createPlayerInput });
  }

  async updatePlayer(id: string, updatePlayerInput: UpdatePlayerInput) {
    const player = await this.playersModel.findOneAndUpdate(
      {
        id,
      },
      updatePlayerInput,
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
    return player;
  }

  async deletePlayer(id: string) {
    const player = await this.getPlayerById(id);
    this.teamService.deletePlayerFromTeam(player.team, id);
    return await this.playersModel.findOneAndDelete({
      id,
    });
  }

  async findPlayersByArray(ids: string[]) {
    let playersPromise = [];
    await Promise.all(
      (playersPromise = ids.map(async (id) => {
        return await this.getPlayerById(id);
      })),
    );
    return await playersPromise;
  }
}
