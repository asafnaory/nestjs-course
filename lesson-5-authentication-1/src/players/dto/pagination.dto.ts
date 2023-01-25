import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  skip?: number;
  @IsOptional()
  @IsNumber()
  take?: number;
}
