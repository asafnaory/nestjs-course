import { Schema ,Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema()
export class Player extends Document {
    @Prop()first_name : string
    @Prop()last_name : string
    @Prop()ppg : string
}

export const PlayerScheama = SchemaFactory.createForClass(Player)