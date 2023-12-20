import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
class groupBloodNotAllowedSchema {
  @Prop({ default: false })
  1: boolean;
  @Prop({ default: false })
  2: boolean;
  @Prop({ default: false })
  3: boolean;
  @Prop({ default: false })
  4: boolean;
}

@Schema({ versionKey: false, timestamps: true })
export class Product {
  @Prop()
  weight: number;

  @Prop()
  calories: number;

  @Prop()
  category: string;

  @Prop()
  title: string;

  @Prop({ required: true })
  groupBloodNotAllowed: groupBloodNotAllowedSchema;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
