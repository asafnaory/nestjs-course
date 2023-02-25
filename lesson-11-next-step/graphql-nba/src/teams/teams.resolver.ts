import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TeamsService } from './teams.service';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { AssignPlayersToTeamInput } from './dto/assign-player-to-team.input';
import { TeamType } from './entities/team.type';
import { PlayersService } from 'src/players/players.service';
import { Team } from './mongo-schema/team.schema';

@Resolver((of) => TeamType)
export class TeamsResolver {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly playersService: PlayersService,
  ) {}

  @Query((returns) => [TeamType])
  async teams() {
    return await this.teamsService.getAllTeams();
  }

  @Query((returns) => TeamType)
  team(@Args('id') id: string) {
    return this.teamsService.getTeamById(id);
  }

  @Mutation((returns) => TeamType)
  createTeam(@Args('createTeamInput') createTeamInput: CreateTeamInput) {
    return this.teamsService.createTeam(createTeamInput);
  }

  @Mutation((returns) => TeamType)
  assignPlayersToTeam(
    @Args('assignPlayersToTeamInput')
    assignPlayersToTeamInput: AssignPlayersToTeamInput,
  ) {
    const { teamId, playerId } = assignPlayersToTeamInput;
    return this.teamsService.assignPlayersToTeam(teamId, playerId);
  }

  @ResolveField()
  async players(@Parent() team: Team) {
    return await this.playersService.findPlayersByArray(team.players);
  }
}
