import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsMongoId, IsNotEmpty, IsString, Min } from 'class-validator';
import { validateAndReverseDate } from 'src/helpers';

export class DiaryExerciseAddDto {
  @ApiProperty({ required: true, description: 'Exercise ID' })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  exercise: string;

  @ApiProperty({ required: true, description: 'Operation date' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => validateAndReverseDate(value))
  date: string;

  @ApiProperty({ required: true, description: 'Exercise time', minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  time: number;

  @ApiProperty({ required: true, description: 'Consumed calories', minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  calories: number;
}
