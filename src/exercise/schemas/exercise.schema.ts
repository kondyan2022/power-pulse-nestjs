import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';

// export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema({ versionKey: false, timestamps: true })
export class Exercise {
  @Prop()
  bodyPart: string;
  @Prop()
  equipment: string;
  @Prop()
  gifUrl: string;
  @Prop()
  name: string;
  @Prop()
  target: string;
  @Prop()
  burnedCalories: number;
  @Prop()
  time: number;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
