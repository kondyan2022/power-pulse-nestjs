import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
// import { HydratedDocument } from 'mongoose';

// export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema({ versionKey: false, timestamps: true })
export class Exercise {
  @ApiProperty()
  @Prop()
  bodyPart: string;

  @ApiProperty()
  @Prop()
  equipment: string;

  @ApiProperty()
  @Prop()
  gifUrl: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  target: string;

  @ApiProperty()
  @Prop()
  burnedCalories: number;

  @ApiProperty()
  @Prop()
  time: number;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
