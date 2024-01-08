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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guards';

@ApiBearerAuth('token')
@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}
  @ApiOperation({
    description: 'Get a full list of exercises',
  })
  @Get()
  @UseGuards(AuthGuard)
  getExercises() {
    return this.exerciseService.getExercise();
  }
  @ApiOperation({
    description: 'Get a full list of exercise groups ',
  })
  @Get('exerciseGroups')
  @UseGuards(AuthGuard)
  getExerciseGroups() {
    return this.exerciseService.getExerciseGroups();
  }

  @ApiOperation({
    description:
      'Get a list of exercises with filtering and pagination options',
  })
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
