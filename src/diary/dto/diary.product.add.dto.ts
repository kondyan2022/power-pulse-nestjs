import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { validateAndReverseDate } from 'src/helpers';

export class DiaryProductAddDto {
  @ApiProperty({ required: true, description: 'Product ID' })
  @IsNotEmpty()
  @IsString()
  product: string;

  @ApiProperty({ required: true, description: 'Operation date' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => validateAndReverseDate(value))
  date: string;

  @ApiProperty({ required: true, description: 'QTY product' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ required: true, description: 'Consumed calories' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  calories: number;
}
