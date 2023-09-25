import { Model } from 'mongoose';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { Team, TeamDocument } from './mongo-schema/team.schema';
import { v4 as uuid } from 'uuid';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    private playerService: PlayersService,
  ) {}

  async getAllTeams() {
    return await this.teamModel.find();
  }

  async getTeamById(id: string) {
    const team = await this.teamModel.findOne({ id });
    if (!team) {
      throw new NotFoundException('Team does not exists');
    }
    return team;
  }

  async createTeam(createTeamInput: CreateTeamInput) {
    const team = await this.teamModel.findOne({ name: createTeamInput.name });
    if (team) {
      throw new ConflictException('Team already exists');
    }
    return await this.teamModel.create({ id: uuid(), ...createTeamInput });
  }

  async deletePlayerFromTeam(teamId: string, playerId: string) {
    const team = await this.teamModel.findOne({ teamId });
    if (!team) {
      throw new NotFoundException('Can not find team');
    }
    const playerIndex = team.players.findIndex(
      (teamPlayerId) => teamPlayerId === playerId,
    );
    const newTeamPlayers = team.players.splice(playerIndex, 1);
    team.players = newTeamPlayers;
    team.save();
    return team;
  }

  async updateTeam(id: string, updateTeamInput: UpdateTeamInput) {
    const team = await this.teamModel.findOneAndUpdate(
      {
        id,
      },
      updateTeamInput,
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
    return team;
  }

  async deleteTeam(id: number) {
    return await this.teamModel.findOneAndDelete({
      id,
    });
  }

  async assignPlayersToTeam(teamId: string, playerId: string) {
    const player = await this.playerService.getPlayerById(playerId);
    if (!player) {
      throw new NotFoundException('Can not find player');
    }
    const team = await this.teamModel.findOne({ id: teamId });
    if (!team) {
      throw new NotFoundException('Can not find team');
    }
    const teamPlayer = team.players.find(
      (teamPlayerId) => teamPlayerId === playerId,
    );
    console.log('teamPlayer: ', teamPlayer);
    if (teamPlayer) {
      throw new ConflictException('Player already exists in the current team');
    }

    player.team = teamId;
    team.players.push(playerId);
    await team.save();
    await player.save();
    return team;
  }
}
