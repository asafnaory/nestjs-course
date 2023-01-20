import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isNestException } from 'src/helpers/helpers';
import { isPrismaError, prismaErrorHandler } from 'src/prisma/prisma.helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ResponsePlayerDto } from './dto/response-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async getAllPlayers(pagination: PaginationDto): Promise<ResponsePlayerDto[]> {
    try {
      const players = await this.prisma.player.findMany({
        ...pagination,
        include: {
          team: true,
        },
      });
      const responsePlayers = players.map(
        (p) =>
          new ResponsePlayerDto(p.id, p.firstName, p.lastName, p.ppg, p.team),
      );
      return responsePlayers;
    } catch (e: unknown) {
      if (isPrismaError(e)) {
        throw prismaErrorHandler(e);
      }
      throw new InternalServerErrorException(e);
    }
  }

  async getPlayerById(id: string): Promise<ResponsePlayerDto> {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          id,
        },
        include: {
          team: true,
        },
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
        player.team,
      );
    } catch (e: unknown) {
      if (isNestException(e)) throw e;
      if (isPrismaError(e)) {
        throw prismaErrorHandler(e);
      }
      throw new InternalServerErrorException(e);
    }
  }

  async createPlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<ResponsePlayerDto> {
    try {
      const player = await this.prisma.player.create({
        data: createPlayerDto,
        include: {
          team: true,
        },
      });

      return new ResponsePlayerDto(
        player.id,
        player.firstName,
        player.lastName,
        player.ppg,
        player.team,
      );
    } catch (e: unknown) {
      if (isPrismaError(e)) {
        throw prismaErrorHandler(e);
      }
      throw new InternalServerErrorException(e);
    }
  }

  async updatePlayer(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<ResponsePlayerDto> {
    {
      try {
        const player = await this.prisma.player.update({
          where: {
            id,
          },
          include: {
            team: true,
          },
          data: updatePlayerDto,
        });
        return new ResponsePlayerDto(
          player.id,
          player.firstName,
          player.lastName,
          player.ppg,
          player.team,
        );
      } catch (e: unknown) {
        if (isPrismaError(e)) {
          throw prismaErrorHandler(e);
        }
        throw new InternalServerErrorException(e);
      }
    }
  }
  async removePlayer(id: string): Promise<ResponsePlayerDto> {
    try {
      const player = await this.prisma.player.delete({
        where: {
          id,
        },
        include: {
          team: true,
        },
      });
      return new ResponsePlayerDto(
        player.id,
        player.firstName,
        player.lastName,
        player.ppg,
        player.team,
      );
    } catch (e: unknown) {
      if (isPrismaError(e)) {
        throw prismaErrorHandler(e);
      }
      throw new InternalServerErrorException(e);
    }
  }
}
