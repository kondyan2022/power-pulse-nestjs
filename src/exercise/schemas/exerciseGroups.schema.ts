import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
// import { HydratedDocument } from 'mongoose';

// export type ExerciseGroupDocument = HydratedDocument<ExerciseGroup>;

@Schema({ versionKey: false, timestamps: true })
export class ExerciseGroup {
  @ApiProperty()
  @Prop()
  filter: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  imgURL: string;
}

export const ExerciseGroupSchema = SchemaFactory.createForClass(ExerciseGroup);
