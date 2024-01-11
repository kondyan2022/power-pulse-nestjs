import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class groupBloodNotAllowedSchema {
  @ApiProperty()
  @Prop({ default: false })
  1: boolean;
  @ApiProperty()
  @Prop({ default: false })
  2: boolean;
  @ApiProperty()
  @Prop({ default: false })
  3: boolean;
  @ApiProperty()
  @Prop({ default: false })
  4: boolean;
}

@Schema({ versionKey: false, timestamps: true })
export class Product {
  @ApiProperty()
  @Prop()
  weight: number;

  @ApiProperty()
  @Prop()
  calories: number;

  @ApiProperty()
  @Prop()
  category: string;

  @ApiProperty()
  @Prop()
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  groupBloodNotAllowed: groupBloodNotAllowedSchema;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
