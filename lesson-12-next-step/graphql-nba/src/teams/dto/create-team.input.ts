import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class CreateTeamInput {
  @MinLength(1)
  @Field()
  name: string;

  @IsString()
  @Field()
  teamColor: string;

  @Field()
  @IsString()
  teamLogo: string;
}
