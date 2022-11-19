import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; //Types
import { Player, PlayerSchema } from '../../players/entities/player.entity';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) password: string;

  // reference id only
  //@Prop([{ type: Types.ObjectId, ref: Player.name }])
  @Prop([PlayerSchema]) //embed sub document
  players: Player[];
}
export const UserSchema = SchemaFactory.createForClass(User);
