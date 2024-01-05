import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { validateAndReverseDate } from 'src/helpers';

export class DiaryItemDeleteDto {
  @ApiProperty({ required: true, description: 'Item ID' })
  @IsNotEmpty()
  @IsString()
  itemid: string;

  @ApiProperty({ required: true, description: 'Operation date' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => validateAndReverseDate(value))
  date: string;
  @ApiProperty({
    required: true,
    description: 'Table name',
    enum: ['exercises', 'products'],
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(products|exercises)$/, {
    message: 'Variable must be "products" or "exercises"',
  })
  tablename: string;
}
