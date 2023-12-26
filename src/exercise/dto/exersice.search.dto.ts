import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ExerciseSearchDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  filter: string;

  @IsOptional()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  target: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  page: number;
}
