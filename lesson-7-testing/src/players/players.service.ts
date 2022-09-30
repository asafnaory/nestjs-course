import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AddToTeamDto } from './dto/add-to-team.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  // https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
  async getAllPlayers(
    paginationQuery: PaginationQueryDto<Player>,
  ): Promise<Player[]> {
    const { skip, take, cursor, where, orderBy } = paginationQuery;
    return await this.prisma.player.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  async getPlayerById(id: string): Promise<Player> {
    return await this.prisma.player.findUnique({
      where: {
        id,
      },
    });
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.prisma.player.create({
      data: { ...createPlayerDto },
    });
  }

  async updatePlayer(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const player = await this.getPlayerById(id);

    if (!player) {
      throw new NotFoundException(`Player with player id ${id} does not exist`);
    }
    return this.prisma.player.update({
      where: {
        id,
      },
      data: {
        ...updatePlayerDto,
      },
    });
  }
  async removePlayer(id: string): Promise<Player> {
    const player = await this.getPlayerById(id);
    if (!player) {
      throw new NotFoundException(`Player with player id ${id} does not exist`);
    }
    return await this.prisma.player.delete({
      where: {
        id,
      },
    });
  }

  async addToTeam(addToTeamDto: AddToTeamDto): Promise<Player> {
    const { playerId, teamId } = addToTeamDto;
    return await this.prisma.player.update({
      where: {
        id: playerId,
      },
      data: { 
        teamId,
      },
    });
  }
}
