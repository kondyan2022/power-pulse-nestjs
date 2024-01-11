import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Category } from 'src/product/schemas';

export class CategoryResponse extends Category {
  @ApiProperty({ type: 'string' })
  _id: Types.ObjectId;
}
