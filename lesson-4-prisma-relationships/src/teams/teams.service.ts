import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getAllTeams(
    paginationQuery: PaginationQueryDto<Team>,
  ): Promise<Team[]> {
    const { skip, take, cursor, where, orderBy } = paginationQuery;
    return await this.prisma.team.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        players: true,
      },
    });
  }

  async getTeamById(id: string): Promise<Team> {
    return this.prisma.team.findUnique({
      where: {
        id,
      },
      include: {
        players: true,
      },
    });
  }

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    return await this.prisma.team.create({
      data: createTeamDto,
      include: {
        players: true,
      },
    });
  }

  async updateTeam(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.getTeamById(id);
    if (!team) {
      throw new NotFoundException(`Team with team id ${id} does not exist`);
    }
    return this.prisma.team.update({
      where: {
        id,
      },
      data: updateTeamDto,
      include: {
        players: true,
      },
    });
  }

  async removeTeam(id: string): Promise<Team> {
    const team = await this.getTeamById(id);
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
