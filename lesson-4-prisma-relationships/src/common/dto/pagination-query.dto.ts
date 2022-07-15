import { Player, Prisma } from '@prisma/client';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto<T> {
  @IsOptional()
  @IsPositive()
  skip: number;

  @IsOptional()
  @IsPositive()
  take: number;

  @IsOptional()
  @IsPositive()
  cursor: T extends Player
    ? Prisma.PlayerWhereUniqueInput
    : Prisma.TeamWhereUniqueInput;

  @IsOptional()
  @IsPositive()
  where: T extends Player ? Prisma.PlayerWhereInput : Prisma.TeamWhereInput;

  @IsOptional()
  @IsPositive()
  orderBy?: T extends Player
    ? Prisma.PlayerOrderByWithRelationInput
    : Prisma.TeamOrderByWithRelationInput;
}