import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Product } from '../../schemas/product.schema';
import { PaginationResponse } from 'src/types';

export class ProductResponse extends Product {
  @ApiProperty({ type: 'string' })
  _id: Types.ObjectId;
}

export class ProductFilterResponse {
  @ApiProperty()
  searchkey: string;
  @ApiProperty()
  category: string;
  @ApiProperty({ type: 'string', enum: ['true', 'false', 'All'] })
  recommend: string;
}

export class ProductSearchResponse extends IntersectionType(
  ProductFilterResponse,
  PaginationResponse,
) {
  @ApiProperty({ type: ProductResponse, isArray: true })
  results: ProductResponse[];
}
