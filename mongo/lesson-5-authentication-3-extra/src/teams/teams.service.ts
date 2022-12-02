import { Player } from '../players/entities/player.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
  ) {}

  async getAllTeams(dto: PaginationQueryDto): Promise<Team[]> {
    const { offset, limit } = dto;
    return await this.teamModel.find().skip(offset).limit(limit);
  }

  async getTeamById(id: string): Promise<Team> {
    const team = await this.teamModel.findById(id).select('-_id');
    if (!team) {
      throw new NotFoundException(`team not found id : ${id}`);
    }
    return team;
  }

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    return await this.teamModel.create(createTeamDto);
  }

  async updateTeam(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const options: QueryOptions = { new: true, upsert: true };
    const team = await this.teamModel
      .findByIdAndUpdate(id, updateTeamDto, options)
      .select('-__v');
    return team;
  }

  async removeTeam(id: string): Promise<Team> {
    const team = await this.teamModel.findByIdAndRemove(id);
    if (!team) {
      throw new NotFoundException(`team not found ${id}`);
    }
    team.players.forEach(async (player) => {
      await this.playerModel.findByIdAndRemove(player.id);
    });
    return team;
  }
}
