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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guards';
import {
  ExerciseGroupResponse,
  ExerciseResponse,
  ExerciseSearchResponse,
} from './dto/responses';
import { ErrorResponse } from 'src/types';

@ApiBearerAuth('token')
@ApiResponse({
  status: 401,
  description: 'Not authorized',
  type: ErrorResponse,
})
@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}
  @ApiOperation({
    description: 'Get a full list of exercises',
  })
  @Get()
  @ApiOkResponse({
    description: 'Successful response',
    type: ExerciseResponse,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  getExercises() {
    return this.exerciseService.getExercise();
  }
  @ApiOperation({
    description: 'Get a full list of exercise groups ',
  })
  @ApiOkResponse({
    description: 'Successful response',
    type: ExerciseGroupResponse,
    isArray: true,
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
  @ApiOkResponse({
    description: 'Successful response',
    type: ExerciseSearchResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad request', type: ErrorResponse })
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
