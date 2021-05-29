import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';
export class CreatePlayerDto{

    @IsNotEmpty()
    @IsString()
    readonly first_name: string
    
    @IsNotEmpty()
    @IsString()
    readonly last_name: string
    
    @IsNotEmpty()
    @IsString()
    readonly ppg : string

}