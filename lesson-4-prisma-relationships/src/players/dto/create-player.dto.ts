import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsNumber()
  readonly ppg: number;

  @IsOptional()
  @IsUUID()
  readonly teamId?: string;
}
