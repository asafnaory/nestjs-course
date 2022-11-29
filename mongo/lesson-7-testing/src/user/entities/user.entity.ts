import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; //Types
import { Player, PlayerSchema } from '../../players/entities/player.entity';
import { UserRole } from '../../auth/roles.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ default: UserRole.USER }) roles: UserRole[];
  
  // reference id only
  //@Prop([{ type: Types.ObjectId, ref: Player.name }])
  @Prop([PlayerSchema]) //embed sub document
  players: Player[];
}
export const UserSchema = SchemaFactory.createForClass(User);
