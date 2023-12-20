import { Controller, Get } from '@nestjs/common';
import { ExerciseService } from './exercise.service';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('exerciseGroups')
  getExerciseGroups() {
    return this.exerciseService.getExerciseGroups();
  }

  @Get()
  getExercise() {
    return this.exerciseService.getExercise();
  }
}
