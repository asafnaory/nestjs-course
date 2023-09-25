import { IsString, IsNotEmpty, Matches, MinLength, IsNumber } from 'class-validator';
export class CreatePlayerDto{

    @IsNotEmpty()
    @IsString()
    readonly firstName: string
    
    @IsNotEmpty()
    @IsString()
    readonly lastName: string
    
    @IsNotEmpty()
    @IsNumber()
    readonly ppg : number

}