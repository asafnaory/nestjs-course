import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  teamColor: string;

  @Prop()
  teamLogo: string;

  @Prop()
  players: string[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
