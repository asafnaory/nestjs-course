import { Field, InputType, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignTeamToPlayerInput {
  @IsUUID()
  @Field((Type) => ID)
  playerId: string;

  @IsUUID()
  @Field((Type) => ID)
  teamId: string;
}
