import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
// import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ResponsePlayerDto } from './dto/response-player.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlayerDto } from './dto/create-player.dto';

// @Roles(Role.BASIC)
	
@ApiTags("players")
@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  // @ApiResponse({status: 403, description: "Forbidden"})
  @ApiForbiddenResponse({description: "Forbidden"})
  getAllPlayers(
    @Query() pagination: PaginationDto,
  ): Promise<ResponsePlayerDto[]> {
    return this.playersService.getAllPlayers(pagination);
  }
  @Get(':id')
  getPlayerById(@Param('id') id: string): Promise<ResponsePlayerDto> {
    return this.playersService.getPlayerById(id);
  }

  @Post()
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<ResponsePlayerDto> {
    return await this.playersService.createPlayer(createPlayerDto);
  }
  @Put(':id')
  updatePlayer(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<ResponsePlayerDto> {
    return this.playersService.updatePlayer(id, updatePlayerDto);
  }

  // @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  removePlayer(@Param('id') id: string): Promise<ResponsePlayerDto> {
    return this.playersService.removePlayer(id);
  }
}
