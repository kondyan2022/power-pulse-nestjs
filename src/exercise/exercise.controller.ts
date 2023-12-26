import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseSearchDto } from './dto';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('exerciseGroups')
  getExerciseGroups() {
    return this.exerciseService.getExerciseGroups();
  }

  @Get('search')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  getExercisesSearch(@Query() exercisesSearchDto: ExerciseSearchDto) {
    return this.exerciseService.getExercisesSearch(exercisesSearchDto);
  }
}
