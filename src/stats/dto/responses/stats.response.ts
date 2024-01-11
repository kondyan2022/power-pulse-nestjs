import { ApiProperty } from '@nestjs/swagger';

export class StatsResponse {
  @ApiProperty()
  countOfExercises: number;

  @ApiProperty()
  totalBurnedCalories: number;

  @ApiProperty()
  totalExercisesTime: number;

  @ApiProperty()
  userCount: number;

  @ApiProperty()
  videoGuides: number;
}
