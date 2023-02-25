import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  position: string;

  @Prop()
  hight: string;

  @Prop()
  ppg: string;

  @Prop()
  imageUrl: string;

  @Prop()
  active: boolean;

  @Prop()
  faceImageUrl: string;

  @Prop()
  team: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
