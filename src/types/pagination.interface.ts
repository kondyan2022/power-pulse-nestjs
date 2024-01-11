import { ApiProperty } from '@nestjs/swagger';

export interface IPagination {
  page: number;
  limit: number;
  totalPage: number;
  totalCount: number;
}

export class PaginationResponse implements IPagination {
  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total count of items' })
  totalCount: number;

  @ApiProperty({ description: 'Total count of pages' })
  totalPage: number;
}
