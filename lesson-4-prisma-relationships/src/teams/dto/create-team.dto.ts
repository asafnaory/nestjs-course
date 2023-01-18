import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, MinLength, IsString, IsArray, ArrayNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @MinLength(3)
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly playersAmount: number;
  
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, {each: true})
  readonly players: string[];
}
