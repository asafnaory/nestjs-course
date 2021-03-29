import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UsePipes } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import { IdvalidationPipe } from './pipes/idvalidation.pipe';

@Controller('players')
@UsePipes(IdvalidationPipe)
export class PlayersController {

    constructor(private playersService: PlayersService){}

    @Get()
    getAllPlayers(): Player[]{
        return this.playersService.getAllPlayers()
    }
    @Get(':id')
    // @UsePipes(IdvalidationPipe)
    getPlayerById(@Param('id', ParseIntPipe) id: number): Player{
        return this.playersService.getPlayerById(id)

    }
    @Post()
    createPlayer(@Body() createPlayerDto: CreatePlayerDto): Player[]{
        return this.playersService.createPlayer(createPlayerDto)
    }
    @Put(':id')
    // @UsePipes(IdvalidationPipe)
    updatePlayer(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePlayerDto: UpdatePlayerDto
    ){
        return this.playersService.updatePlayer(id,updatePlayerDto) 
    }
    
    @Delete(':id')
    // @UsePipes(IdvalidationPipe)
    removePlayer(
        @Param('id') id: number, 
    ){
        return this.playersService.removePlayer(id) 
    }
}
