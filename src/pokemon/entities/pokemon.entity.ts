import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema() //Decorador Schema de @nestjs/mongoose
export class Pokemon extends Document {
  //id: string: //mongo me lo maneja de manera automanica
  @Prop({ unique: true, index: true })
  name: string;

  @Prop({ unique: true, index: true })
  no: number;
}

export const pokemnonSchema = SchemaFactory.createForClass(Pokemon); //Crea un Schema en base a una clase
