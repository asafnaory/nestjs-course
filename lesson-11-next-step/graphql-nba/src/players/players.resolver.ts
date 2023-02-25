import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Query,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RandomGuard } from 'src/random.guard';
import { TeamsService } from 'src/teams/teams.service';
import { CreatePlayerInput } from './dto/create-player.input';
import { UpdatePlayerInput } from './dto/update-player.input';
import { PlayerType } from './entities/player.type';
import { Player } from './mongo-schema/player.schema';
import { PlayersService } from './players.service';

// @UseGuards(RandomGuard)
@Resolver((of) => PlayerType)
export class PlayersResolver {
  constructor(
    private playerService: PlayersService,
    private teamService: TeamsService,
  ) {}

  @Query((returns) => PlayerType)
  async player(@Args('id') id: string) {
    return await this.playerService.getPlayerById(id);
  }

  @Query((returns) => [PlayerType])
  async players() {
    return await this.playerService.getAllPlayers();
  }

  @Mutation((returns) => PlayerType)
  async createPlayer(
    @Args('createPlayerInput') createPlayerInput: CreatePlayerInput,
  ) {
    return await this.playerService.createPlayer(createPlayerInput);
  }

  @Mutation((returns) => PlayerType)
  async updatePlayer(
    @Args('updatePlayerInput') updatePlayerInput: UpdatePlayerInput,
    @Args('id') id: string,
  ) {
    return await this.playerService.updatePlayer(id, updatePlayerInput);
  }

  @Mutation((returns) => PlayerType)
  async deletePlayer(@Args('id') id: string) {
    return await this.playerService.deletePlayer(id);
  }

  @ResolveField()
  async team(@Parent() player: Player) {
    return await this.teamService.getTeamById(player.team);
  }
}
