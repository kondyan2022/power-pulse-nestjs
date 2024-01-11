import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, SchemaTimestampsConfig, Types } from 'mongoose';

@Schema()
class productItemModel {
  @ApiProperty({ type: 'string' })
  _id: {
    type: Types.ObjectId;
    ref: 'Product';
    required: true;
  };
  // @ApiProperty()
  // id: string;
  @ApiProperty()
  @Prop({ required: true })
  title: string;
  @ApiProperty()
  @Prop({ required: true })
  category: string;
  @ApiProperty()
  @Prop({ min: [1, 'Must be at least 1, got {VALUE}!'], required: true })
  weight: number;
  @ApiProperty()
  @Prop({ min: [1, 'Must be at least 1, got {VALUE}!'], required: true })
  consumeCalories: number;
  @ApiProperty()
  @Prop({ default: true })
  recommend: boolean;
}
@Schema()
class exerciseItemModel {
  @ApiProperty({ type: 'string' })
  _id: {
    type: Types.ObjectId;
    ref: 'Exercise';
    required: true;
  };

  // @ApiProperty()
  // id: string;

  @ApiProperty()
  @Prop({ required: true })
  bodyPart: string;

  @ApiProperty()
  @Prop({ required: true })
  equipment: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  target: string;

  @ApiProperty()
  @Prop({ min: [1, 'Must be at least 1, got {VALUE}!'], required: true })
  burnedCalories: number;

  @ApiProperty()
  @Prop({ min: [1, 'Must be at least 1, got {VALUE}!'], required: true })
  time: number;
}

export type DiaryDocument = HydratedDocument<Diary> & SchemaTimestampsConfig;

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  virtuals: {
    burnedCalories: {
      get() {
        return this.exercises.reduce(
          (acc: number, { burnedCalories }) => acc + burnedCalories,
          0,
        );
      },
    },
    consumedCalories: {
      get() {
        return this.products.reduce(
          (acc: number, { consumeCalories }) => acc + consumeCalories,
          0,
        );
      },
    },
    leftExercisesTime: {
      get() {
        return (
          this.DSN -
          Math.round(
            this.exercises.reduce((acc: number, { time }) => acc + time, 0) /
              60,
          )
        );
      },
    },
    leftCalories: {
      get() {
        return (
          this.BMR -
          Math.round(
            this.products.reduce(
              (acc: number, { consumeCalories }) => acc + consumeCalories,
              0,
            ),
          )
        );
      },
    },
  },
})
export class Diary {
  @ApiProperty({ type: 'string' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: {
    type: Types.ObjectId;
    ref: 'User';
    required: true;
  };

  @ApiProperty()
  @Prop({ required: true, minlength: 8, maxlength: 8 })
  date: string;

  @ApiProperty()
  @Prop({ required: true })
  DSN: number;

  @ApiProperty()
  @Prop({ required: true })
  BMR: number;

  @ApiProperty({ type: productItemModel, isArray: true })
  @Prop({
    type: [productItemModel],
  })
  products: productItemModel[];

  @ApiProperty({ type: exerciseItemModel, isArray: true })
  @Prop({
    type: [exerciseItemModel],
  })
  exercises: exerciseItemModel[];

  @ApiProperty()
  burnedCalories: number;
  @ApiProperty()
  consumedCalories: number;
  @ApiProperty()
  leftExercisesTime: number;
  @ApiProperty()
  leftCalories: number;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
