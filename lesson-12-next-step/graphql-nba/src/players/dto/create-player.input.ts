import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDateString, IsString, MinLength } from 'class-validator';

@InputType()
export class CreatePlayerInput {
  @MinLength(1)
  @Field()
  name: string;

  @IsString()
  @Field()
  position: string;

  @IsString()
  @Field()
  hight: string;

  @IsString()
  @Field()
  ppg: string;

  @IsString()
  @Field()
  imageUrl: string;

  @IsBoolean()
  @Field()
  active: boolean;

  @IsString()
  @Field()
  faceImageUrl: string;
}
