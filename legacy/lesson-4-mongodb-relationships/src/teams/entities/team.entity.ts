import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Player, PlayerSchema } from '../../players/entities/player.entity';

@Schema({timestamps: true})
export class Team extends Document {
    @Prop() name: string;
    @Prop() playersAmount: number;
    
    //Option 1 - embed sub document 
    @Prop({PlayerSchema}) players:Player[];

    // Option 2- reference id only 

    // @Prop({type: Types.ObjectId, ref: 'Player' }) players:Player[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
