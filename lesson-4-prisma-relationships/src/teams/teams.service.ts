import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

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
    return await this.prisma.team.findMany();
  }

  findOne(id: string) {
    return this.prisma.team.findUnique({
      where: {
        id,
      },
      include: {
        players: true,
      },
    });
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const { name, playersAmount, playerIds } = updateTeamDto;
    const team = await this.findOne(id);
    if (!team) {
      throw new NotFoundException(`Team with team id ${id} does not exist`);
    }
    return this.prisma.team.update({
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
  }

  async remove(id: string) {
    const team = await this.findOne(id);
    if (!team) {
      throw new NotFoundException(`Team with team id ${id} does not exist`);
    }
    return await this.prisma.team.delete({
      where: {
        id,
      },
      include: {
        players: true,
      },
    });
  }
}
