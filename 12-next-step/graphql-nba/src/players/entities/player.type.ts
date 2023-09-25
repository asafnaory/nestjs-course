import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TeamType } from 'src/teams/entities/team.type';

@ObjectType('Player')
export class PlayerType {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  position: string;

  @Field()
  hight: string;

  @Field()
  ppg: string;

  @Field()
  imageUrl: string;

  @Field()
  active: boolean;

  @Field()
  faceImageUrl: string;

  @Field((type) => TeamType)
  team: string;
}
