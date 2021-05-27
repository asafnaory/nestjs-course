import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';
export class CreatePlayerDto{

    @IsNotEmpty()
    @IsString()
    readonly firstName: string
    
    @IsNotEmpty()
    @IsString()
    readonly lastName: string
    
    @IsNotEmpty()
    @IsString()
    readonly ppg : string

}