import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import { PlayersExceptionFilter } from 'src/filters/players-exception.filter';

@UseFilters(PlayersExceptionFilter)
@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  getAllPlayers(): Player[] {
    // return this.playersService.getAllPlayers()
    throw new NotFoundException();
  }
  @Get(':id')
  getPlayerById(@Param('id', ParseIntPipe) id: number): Player {
    return this.playersService.getPlayerById(id);
  }

  @Post()
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): Player[] {
    return this.playersService.createPlayer(createPlayerDto);
  }
  @Put(':id')
  updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playersService.updatePlayer(id, updatePlayerDto);
  }

  @Delete(':id')
  removePlayer(@Param('id') id: number) {
    return this.playersService.removePlayer(id);
  }
}
