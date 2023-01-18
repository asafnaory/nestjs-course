import { Injectable, NotFoundException } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ResponsePlayerDto } from './dto/response-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async getAllPlayers(pagination: PaginationDto): Promise<ResponsePlayerDto[]> {
    const players = await this.prisma.player.findMany({ ...pagination });
    const responsePlayers = players.map(
      (p) => new ResponsePlayerDto(p.id, p.firstName, p.lastName, p.ppg),
    );
    return responsePlayers;
  }

  async getPlayerById(id: string): Promise<ResponsePlayerDto> {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    });
    if (!player) {
      throw new NotFoundException(`Player with player id ${id} does not exist`);
    }
    return new ResponsePlayerDto(
      player.id,
      player.firstName,
      player.lastName,
      player.ppg,
    );
  }

  async createPlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<ResponsePlayerDto> {
    const player = await this.prisma.player.create({
      data: createPlayerDto,
    });

    return new ResponsePlayerDto(
      player.id,
      player.firstName,
      player.lastName,
      player.ppg,
    );
  }

  async updatePlayer(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<ResponsePlayerDto> {
    {
      const player = await this.prisma.player.update({
        where: {
          id,
        },
        data: updatePlayerDto,
      });

      if (!player) {
        throw new NotFoundException(
          `Player with player id ${id} does not exist`,
        );
      }

      return new ResponsePlayerDto(
        player.id,
        player.firstName,
        player.lastName,
        player.ppg,
      );
    }
  }
  async removePlayer(id: string): Promise<ResponsePlayerDto> {
    const player = await this.prisma.player.delete({
      where: {
        id,
      },
    });

    if (!player) {
      throw new NotFoundException(`Player with player id ${id} does not exist`);
    }

    return new ResponsePlayerDto(
      player.id,
      player.firstName,
      player.lastName,
      player.ppg,
    );
  }
}
