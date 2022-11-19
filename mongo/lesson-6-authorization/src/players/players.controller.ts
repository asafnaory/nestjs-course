import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, UseGuards, Req } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import { IdvalidationPipe } from './pipes/idvalidation.pipe';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('players')
// @UsePipes(IdvalidationPipe)
export class PlayersController {

    constructor(private playersService: PlayersService){}

    @Get()
    async getAllPlayers(@Query() dto: PaginationQueryDto): Promise<Player[]>{
        return await this.playersService.getAllPlayers(dto)
    }
    @Get(':id')
    async getPlayerById(@Param('id', IdvalidationPipe) id: string): Promise<Player>{
        console.log(id);
        return await this.playersService.getPlayerById(id)
    }
    
    @Post()
    // @Roles(UserRole.ADMIN)
    // @UseGuards(RolesGuard)
    // @UseGuards(AuthGuard('jwt'))
    async createPlayer(@Req() req, @Body() createPlayerDto: CreatePlayerDto): Promise<Player>{
        return await this.playersService.createPlayer(createPlayerDto)
    }
    @Put(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async updatePlayer(
    @Param('id', IdvalidationPipe) id: string, 
    @Body() updatePlayerDto: UpdatePlayerDto
    ): Promise<Player>{
        return await this.playersService.updatePlayer(id ,updatePlayerDto) 
    }
    
    @Delete('player/:playerId/team/:teamId')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async  removePlayer(
        @Param('playerId', IdvalidationPipe) playerId: string, 
        @Param('teamId', IdvalidationPipe) teamId: string, 
    ):Promise<Player>{
        return await this.playersService.removePlayer(playerId, teamId) 
    }
}
