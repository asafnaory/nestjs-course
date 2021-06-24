import { Schema ,Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema()
export class Player extends Document {
    @Prop()firstName : string
    @Prop()lastName : string
    @Prop()ppg : string
}

export const PlayerScheama = SchemaFactory.createForClass(Player)