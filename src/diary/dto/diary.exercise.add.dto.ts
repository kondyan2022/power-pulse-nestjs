import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { validateAndReverseDate } from 'src/helpers';

export class DiaryExerciseAddDto {
  @ApiProperty({ required: true, description: 'Exercise ID' })
  @IsNotEmpty()
  @IsString()
  exercise: string;

  @ApiProperty({ required: true, description: 'Operation date' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => validateAndReverseDate(value))
  date: string;

  @ApiProperty({ required: true, description: 'Exercise time' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  time: number;

  @ApiProperty({ required: true, description: 'Consumed calories' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  calories: number;
}
