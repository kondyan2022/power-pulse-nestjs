import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ExerciseSearchDto {
  @ApiProperty({
    required: false,
    enum: ['Body part', 'Equipment', 'Muscles'],
    description: 'Filter filed name for exercise group.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  filter: string;

  @ApiProperty({
    required: false,
    description: 'Value for field specified in "filter" parameter',
  })
  @IsOptional()
  @IsString()
  value: string;

  @ApiProperty({
    required: false,
    description: 'Value for filter by field "target"',
  })
  @IsOptional()
  @IsString()
  target: string;

  @ApiProperty({
    required: false,
    default: 20,
    description: 'Items per page',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number;

  @ApiProperty({
    required: false,
    default: 0,
    description: 'Page number',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  page: number;
}
