import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { DiaryDeleteFromListDto } from './diary.deleteFromList.dto';

export class DiaryItemDeleteDto extends DiaryDeleteFromListDto {
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
