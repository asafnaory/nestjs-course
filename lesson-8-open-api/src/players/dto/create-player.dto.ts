import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
export class CreatePlayerDto {
  
  @ApiProperty({description: "the first name of the player", example: "Asaf"})
  @IsString()
  readonly firstName: string;

  @ApiProperty({description: "the last name of the player",  example: "Naory"})

  @IsString()
  readonly lastName: string;


  @ApiProperty({description: "Point Per Game", example: 23})
  @IsNumber()
  readonly ppg: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly agentId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly teamId?: string;
}
