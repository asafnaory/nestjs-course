import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
  ) {}

  async getAllPlayers(dto: PaginationQueryDto): Promise<Player[]> {
    const { offset, limit } = dto;
    return await this.playerModel.find().skip(offset).limit(limit);
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id);
    // .select('-_id -__v')
    // .select('firstName')
    // _id and __v is opt-out, all other fields are opt-in
    if (!player) throw new NotFoundException(`Player not found id:'${id}'`);
    return player;
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel.create(createPlayerDto);
  }

  async updatePlayer(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const options: QueryOptions = { new: true, upsert: true };
    const player = await this.playerModel
      .findByIdAndUpdate(id, updatePlayerDto, options)
      .select('-__v'); // omit the __v field
    return player;
  }

  async removePlayer(id: string): Promise<Player> {
    return await this.playerModel.findByIdAndRemove(id);
  }
}
