import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';



@Injectable()
export class PlayersService {
    
    players: Player[] = [
        {
            id: 1,
            firstName: "Michael",
            lastName: "Jordan",
            ppg: 30

        },
        {
            id: 2,
            firstName: "Lebron",
            lastName: "James",
            ppg: 27

        },
        {
            id: 3,
            firstName: "Kobe",
            lastName: "Brayent",
            ppg: 25

        }
    ]

    getAllPlayers(): Player[]{      
        return [...this.players]
    }
    getPlayerById(id:number): Player{
        const player = this.findPlayerById(id)
        return {...player}
    }
    createPlayer(createPlayerDto: CreatePlayerDto): Player[]{
            const player: Player =  {
                id: this.createId(),
                firstName: createPlayerDto.firstName,
                lastName: createPlayerDto.lastName,
                ppg: parseInt(createPlayerDto.ppg)
            }
            this.players.push(player)
            return [...this.players]
    }

    updatePlayer(id:number, updatePlayerDto: UpdatePlayerDto): Player{
        let player = this.findPlayerById(id)
        
        const playerIdx = this.players.findIndex((player) => {
            return player.id === id
        })
        player = this.checkIfPlayerNeedsUpdate(updatePlayerDto, player);
    
        this.players[playerIdx] = player;
        return {...this.players[playerIdx]}
    }

    removePlayer(id:number): Player[]{
        const playerIdx = this.players.findIndex((player)=>{
            return player.id === id
        })
        this.players.splice(playerIdx,1);
        return [...this.players]
    }

    private createId(){
        return Math.floor(Math.random() * Math.floor(1000))
    }

    private checkIfPlayerNeedsUpdate(updatePlayerDto: UpdatePlayerDto, player: Player ){
        if(updatePlayerDto.firstName){
            player.firstName = updatePlayerDto.firstName
        }
        if(updatePlayerDto.lastName){
            player.lastName = updatePlayerDto.lastName
        }
        if(updatePlayerDto.ppg){
            player.ppg = parseInt(updatePlayerDto.ppg)
        }
        return player
    }

    private findPlayerById(id){
        return this.players.find((player)=>{
            return player.id === id
        })
    }
}
