import { IsString } from "class-validator";

export class AddToTeamDto {
    @IsString()
    playerId: string
    
    @IsString()
    teamId: string
}