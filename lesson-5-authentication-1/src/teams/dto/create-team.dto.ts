import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

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
  readonly playerIds: Record<'id', string>;
}
