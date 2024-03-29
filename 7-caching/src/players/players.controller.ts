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
  UseInterceptors,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ResponsePlayerDto } from './dto/response-player.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/iam/guards/roles.guard';
import { Roles } from 'src/iam/decorators/roles.decorator';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Roles([Role.ADMIN])
@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('players')
  @UseGuards(RolesGuard)
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

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Delete(':id')
  removePlayer(@Param('id') id: string): Promise<ResponsePlayerDto> {
    return this.playersService.removePlayer(id);
  }
}
