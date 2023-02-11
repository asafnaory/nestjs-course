import { ApiProperty } from '@nestjs/swagger';
import { Team } from '@prisma/client';

export class ResponsePlayerDto {
  @ApiProperty({ description: 'some id', example: '1' })
  readonly id: string;
  @ApiProperty({ description: 'first name', example: 'Asaf' })
  private firstName: string;
  @ApiProperty({ description: 'first name', example: 'Naory' })
  private lastName: string;
  @ApiProperty({ description: 'points per game', example: '23' })
  private ppg: number;
  @ApiProperty({ description: 'Plyers team id', example: '1' })
  private team?: Team;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    ppg: number,
    team?: Team,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.ppg = ppg;
    this.team = team;
  }
}
