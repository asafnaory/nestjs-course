import { Schema ,Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Team } from "../../teams/entities/team.entity";


@Schema({ timestamps: true })
@Schema()
export class Player extends Document {
    @Prop()first_name : string
    @Prop()last_name : string
    @Prop()ppg : string

    // reference by id only 
    @Prop({type: Types.ObjectId, ref: 'Team'}) team: Team;

}

export const PlayerSchema = SchemaFactory.createForClass(Player)