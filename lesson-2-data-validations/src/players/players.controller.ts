import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
// import { CreatePlayerDto } from './dto/class-validator/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';
import { IdvalidationPipe } from './pipes/idvalidation.pipe';
// import { UpdatePlayerDto } from './dto/class-validator/update-player.dto';
import { ZodValidationPipe } from './pipes/zod-validation-pipe';
import {
  CreatePlayerDto,
  createPlayerSchema,
} from './dto/zod/create-player.dto';
import {
  UpdatePlayerDto,
  updatePlayerSchema,
} from './dto/zod/update-player.dto';

@Controller('players')
// @UsePipes(IdvalidationPipe)
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  getAllPlayers(): Player[] {
    return this.playersService.getAllPlayers();
  }
  @Get(':id')
  @UsePipes(IdvalidationPipe)
  getPlayerById(@Param('id') id: number): Player {
    return this.playersService.getPlayerById(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createPlayerSchema))
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): Player[] {
    return this.playersService.createPlayer(createPlayerDto);
  }
  @Put(':id')
  //   @UsePipes(IdvalidationPipe)
  @UsePipes(new ZodValidationPipe(updatePlayerSchema))
  updatePlayer(
    @Param('id') id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playersService.updatePlayer(id, updatePlayerDto);
  }

  @Delete(':id')
  @UsePipes(IdvalidationPipe)
  removePlayer(@Param('id') id: number) {
    return this.playersService.removePlayer(id);
  }
}
