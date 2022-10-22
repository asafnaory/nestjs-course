import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Team } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { IdvalidationPipe } from '../pipes/idvalidation.pipe';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
  @Get()
  async getAllteams(@Query() paginationQuery: PaginationQueryDto<Team>): Promise<Team[]> {
    return await this.teamsService.getAllTeams(paginationQuery);
  }

  @Get(':id')
  async getteamById(@Param('id') id: string): Promise<Team> {
    return await this.teamsService.getTeamById(id);
  }

  @Post()
  async createteam(@Body() dto: CreateTeamDto): Promise<Team> {
    return await this.teamsService.createTeam(dto);
  }

  @Put(':id')
  async updateteam(
    @Param('id', IdvalidationPipe) id: string,
    @Body() dto: UpdateTeamDto,
  ): Promise<Team> {
    return await this.teamsService.updateTeam(id, dto);
  }

  @Delete(':id')
  @UsePipes(IdvalidationPipe)
  async removeteam(@Param('id') id: string): Promise<Team> {
    return await this.teamsService.removeTeam(id);
  }
}
