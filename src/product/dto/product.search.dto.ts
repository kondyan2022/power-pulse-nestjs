import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ProductSearchDto {
  @ApiProperty({
    required: false,
    default: '',
    description: 'String for query search',
  })
  @IsOptional()
  @IsString()
  q: string;

  @ApiProperty({ required: false, description: 'Category for query search' })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({
    required: false,
    default: 20,
    minimum: 1,
    description: 'Page items limit',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  @Min(1)
  limit: number;

  @ApiProperty({
    required: false,
    default: 0,
    minimum: 0,
    description: 'Page number',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  @Min(0)
  page: number;

  @ApiProperty({ required: false, description: 'Product recommended' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  recommend: boolean;
}
