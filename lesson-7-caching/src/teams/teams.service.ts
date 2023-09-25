import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isPrismaError, prismaErrorHandler } from 'src/prisma/prisma.helpers';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { handleErrors, isNestException } from 'src/helpers/helpers';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    const { name, playersAmount, playerIds } = createTeamDto;
    return await this.prisma.team.create({
      data: {
        name,
        playersAmount,
        players: {
          connect: playerIds,
        },
      },
      include: {
        players: true,
      },
    });
  }

  async findAll() {
    try {
      return await this.prisma.team.findMany({
        include: {
          players: true,
        },
      });
    } catch (e: unknown) {
      handleErrors(e);
    }
  }

  findOne(id: string) {
    try {
      const team = this.prisma.team.findUnique({
        where: {
          id,
        },
        include: {
          players: true,
        },
      });
      if (!team)
        throw new NotFoundException(`team with id ${id} was not found`);

      return team;
    } catch (e: unknown) {
      handleErrors(e);
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const { name, playersAmount, playerIds } = updateTeamDto;
    try {
      return await this.prisma.team.update({
        where: {
          id,
        },
        data: {
          name,
          playersAmount,
          players: {
            connect: playerIds,
          },
        },
        include: {
          players: true,
        },
      });
    } catch (e: unknown) {
      handleErrors(e);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.team.delete({
        where: {
          id,
        },
        include: {
          players: true,
        },
      });
    } catch (e: unknown) {
      handleErrors(e);
    }
  }
}
