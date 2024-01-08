import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { validateAndReverseDate } from 'src/helpers';

export class DiaryDeleteFromListDto {
  @ApiProperty({ required: true, description: 'Item ID' })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  itemid: string;

  @ApiProperty({ required: true, description: 'Operation date' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => validateAndReverseDate(value))
  date: string;
}
