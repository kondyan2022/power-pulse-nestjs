import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTimestampsConfig, Types } from 'mongoose';

@Schema()
class productItemModel {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId: { type: Types.ObjectId; ref: 'Product' };

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ min: [1, 'Must be at least 1, got {VALUE}!'], required: true })
  weight: number;

  @Prop({ min: [1, 'Must be at least 1, got {VALUE}!'], required: true })
  consumeCalories: number;

  @Prop({ default: true })
  recommend: boolean;
}

class exerciseItemModel {
  @Prop({ type: Types.ObjectId, ref: 'Exercise' })
  exerciseId: { type: Types.ObjectId; ref: 'Exercise' };

  @Prop({ required: true })
  bodyPart: string;

  @Prop({ required: true })
  equipment: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  target: string;

  @Prop({ min: [1, 'Must be at least 1, got {VALUE}!'], required: true })
  burnedCalories: number;

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
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: {
    type: Types.ObjectId;
    ref: 'User';
    required: true;
  };

  @Prop({ required: true, minlength: 8, maxlength: 8 })
  date: string;

  @Prop({ required: true })
  DSN: number;

  @Prop({ required: true })
  BMR: number;

  @Prop({
    type: [productItemModel],
  })
  products: productItemModel[];

  @Prop({
    type: [exerciseItemModel],
  })
  exercises: exerciseItemModel[];

  burnedCalories: number;
  consumedCalories: number;
  leftExercisesTime: number;
  leftCalories: number;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
