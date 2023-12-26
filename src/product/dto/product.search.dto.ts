// import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ProductSearchDto {
  //   @ApiProperty({
  //     required: false,
  //     default: '',
  //     description: 'String for query search',
  //   })
  @IsOptional()
  @IsString()
  q: string;

  //   @ApiProperty({ required: false, description: 'Category for query search' })
  @IsOptional()
  @IsString()
  category: string;

  //   @ApiProperty({
  //     required: false,
  //     default: 20,
  //     minimum: 1,
  //     description: 'Page items limit',
  //   })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number;

  //   @ApiProperty({
  //     required: false,
  //     default: 0,
  //     minimum: 0,
  //     description: 'Page number',
  //   })
  @IsOptional()
  @IsInt()
  @Min(0)
  page: number;

  //   @ApiProperty({ required: false, description: 'Product recommended' })
  @IsOptional()
  @IsBoolean()
  recommend: boolean;
}
