import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

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
      include: {
        team: true,
      },
    });
  }
  async getPlayerById(id: string): Promise<Player> {
    return this.prisma.player.findUnique({
      where: {
        id,
      },
      include: {
        team: true,
      },
    });
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.prisma.player.create({
      data: { ...createPlayerDto },
      include: {
        team: true,
      },
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
      include: {
        team: true,
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
}
