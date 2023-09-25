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
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ResponsePlayerDto } from './dto/response-player.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AccessTokenGuard } from 'src/iam/guards/access-token.guard';
import { Public } from 'src/iam/decorators/public.decorator';

@Controller('players')
// @Public()
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
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

  @Delete(':id')
  removePlayer(@Param('id') id: string): Promise<ResponsePlayerDto> {
    return this.playersService.removePlayer(id);
  }
}
