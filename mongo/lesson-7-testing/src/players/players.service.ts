import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Team } from '../teams/entities/team.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
  ) {}

  async getAllPlayers(dto: PaginationQueryDto): Promise<Player[]> {
    const { offset, limit } = dto;

    return await this.playerModel.find().skip(offset).limit(limit);
    // .populate({ path: 'team', select: '-players' }); //exclude redundent data
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id);
    // .select('-id first_name last_name ppg')
    // _id is opt-out, all other fields are opt-in
    if (!player) throw new NotFoundException(`Player not found id:'${id}'`);
    return player;
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = await this.playerModel.create(createPlayerDto);
    const team = await this.teamModel.findById(createPlayerDto.team);
    team.players.push(player);
    await team.save();

    return player;
  }

  async updatePlayer(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const options: QueryOptions = { new: true, upsert: true };
    const player = await this.playerModel
      .findByIdAndUpdate(id, updatePlayerDto, options)
      .select('-__v'); // ommit the __v field
    return player;
  }

  async removePlayer(playerId: string, teamId: string): Promise<Player> {
    const player = await this.playerModel.findByIdAndRemove(playerId);
    if (!player) {
      throw new NotFoundException(`Player not found id:'${playerId}'`);
    }
    const team = await this.teamModel.findById(teamId);
    //Delete player from team
    const playerIndex = team.players.findIndex(
      (player) => player._id === playerId,
    );
    team.players.splice(playerIndex, 1);
    await team.save();
    return player;
  }
}
