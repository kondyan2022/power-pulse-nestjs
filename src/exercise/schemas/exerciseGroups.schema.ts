import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExerciseGroupDocument = HydratedDocument<ExerciseGroup>;

@Schema({ versionKey: false, timestamps: true })
export class ExerciseGroup {
  @Prop()
  filter: string;

  @Prop()
  name: string;

  @Prop()
  imgURL: string;
}

export const ExerciseGroupSchema = SchemaFactory.createForClass(ExerciseGroup);
