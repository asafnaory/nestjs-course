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
  import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { IdvalidationPipe } from 'src/players/pipes/idvalidation.pipe';
  import { CreateTeamDto } from './dto/create-team.dto';
  import { UpdateTeamDto } from './dto/update-team.dto';
  import { Team } from './entities/team.entity';
  import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}
    @Get()
    async getAllteams(@Query() dto: PaginationQueryDto): Promise<Team[]> {
      return await this.teamsService.getAllTeams(dto);
    }
  
    @Get(':id')
    @UsePipes(IdvalidationPipe)
    async getteamByID(@Param('id') id: string): Promise<Team> {
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
