import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { IdvalidationPipe } from './pipes/idvalidation.pipe';
import { Player } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { AddToTeamDto } from './dto/add-to-team.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  // https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
  @Get()
  async getAllPlayers(
    @Query() paginationQuery: PaginationQueryDto<Player>,
  ): Promise<Player[]> {
    return await this.playersService.getAllPlayers(paginationQuery);
  }
  @Get(':id')
  @UsePipes(IdvalidationPipe)
  async getPlayerById(@Param('id') id: string): Promise<Player> {
    return await this.playersService.getPlayerById(id);
  }

  @Post()
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }
  @Put(':id')
  @UsePipes(IdvalidationPipe)
  async updatePlayer(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.updatePlayer(id, updatePlayerDto);
  }

  @Delete(':id')
  @UsePipes(IdvalidationPipe)
  async removePlayer(@Param('id') id: string): Promise<Player> {
    return await this.playersService.removePlayer(id);
  }

  @Post('add-to-team')
  // @UseGuards(AuthGuard())
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async addToTeam(@Body() addToTeamDto: AddToTeamDto) {
    console.log('addToTeam');
    return await this.playersService.addToTeam(addToTeamDto);
  }
}
