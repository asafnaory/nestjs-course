import { Field, InputType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignPlayersToTeamInput {
  @IsUUID()
  @Field((Type) => ID)
  playerId: string;

  @IsUUID()
  @Field((Type) => ID)
  teamId: string;
}
