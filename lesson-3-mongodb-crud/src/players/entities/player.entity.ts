import { Schema ,Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema()
export class Player extends Document {
    // set conplex type (object, array or add options ) for more options : https://mongoosejs.com/docs/schematypes.html#schematype-options
    // for example: 
    @Prop(/*{default:'test', required: true}*/)firstName : string
    @Prop()lastName : string
    @Prop()ppg : string
}
// Nest converts the class syntax into the Mongoose schema syntax
export const PlayerScheama = SchemaFactory.createForClass(Player)