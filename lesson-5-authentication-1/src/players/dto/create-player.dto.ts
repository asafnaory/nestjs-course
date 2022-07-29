import { IsString, IsNumber, IsOptional } from 'class-validator';
export class CreatePlayerDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsNumber()
  readonly ppg: number;

  @IsString()
  @IsOptional()
  readonly agentId?: string;

  @IsString()
  @IsOptional()
  readonly teamId?: string;
}
