import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxDate,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class UserProfileDto {
  @ApiProperty({
    minimum: 150,
    required: true,
  })
  @IsInt()
  @Min(150)
  height: number;

  @ApiProperty({ minimum: 35, required: true })
  @IsInt()
  @Min(35)
  currentWeight: number;

  @ApiProperty({
    minimum: 35,
    required: true,
  })
  @IsInt()
  @Min(35)
  desiredWeight: number;

  @ApiProperty({
    required: true,
    enum: [1, 2, 3, 4],
  })
  @IsInt()
  @IsIn([1, 2, 3, 4])
  blood: number;

  @ApiProperty({
    required: true,
    enum: ['male', 'female'],
  })
  @IsString()
  @IsIn(['male', 'female'])
  sex: string;

  @ApiProperty({
    required: true,
    enum: [1, 2, 3, 4, 5],
  })
  @IsInt()
  @IsIn([1, 2, 3, 4, 5])
  levelActivity: number;

  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => {
    if (value.toString() === 'Invalid Date') {
    }
    return value;
  })
  @IsDate()
  @MaxDate(
    () => {
      const nowDate = new Date();
      nowDate.setFullYear(nowDate.getFullYear() - 18);
      return nowDate;
    },
    { message: 'Age must be at least 18 years old.' },
  )
  birthday: Date;
}

export class UserUpdateDto {
  @ApiPropertyOptional({
    minLength: 2,
    description: 'User name',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  profile: UserProfileDto;
}
