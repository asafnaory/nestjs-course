import { IsString, IsNotEmpty, Matches, MinLength, IsNumber, IsOptional } from 'class-validator';
export class CreatePlayerDto{

    @IsString()
    readonly firstName: string
    
    @IsString()
    readonly lastName: string
    
    @IsNumber()
    readonly ppg : number

    @IsString()
    @IsOptional()
    readonly teamId? : string

}