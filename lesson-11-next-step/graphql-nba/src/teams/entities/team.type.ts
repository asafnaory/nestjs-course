import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PlayerType } from 'src/players/entities/player.type';

@ObjectType('Team')
export class TeamType {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  teamColor: string;

  @Field()
  teamLogo: string;

  @Field((type) => [PlayerType])
  players: string[];
}
