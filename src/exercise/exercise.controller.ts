import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseSearchDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guards';

@ApiBearerAuth('token')
@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('exerciseGroups')
  @UseGuards(AuthGuard)
  getExerciseGroups() {
    return this.exerciseService.getExerciseGroups();
  }

  @Get('search')
  @UseGuards(AuthGuard)
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
