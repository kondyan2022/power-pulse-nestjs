import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class DiaryProductAddDto {
  @ApiProperty({ required: true, description: 'Product ID' })
  @IsNotEmpty()
  @IsString()
  product: string;

  @ApiProperty({ required: true, description: 'Operation date' })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(19[0-9][0-9]|20[012][0-9])(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
    { message: 'Invalid data format. YYYYMMDD required!' },
  )
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
