import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DiaryService } from './diary.service';
import { AuthGuard, HasProfileGuard } from 'src/user/guards';
import { CurrentUser } from 'src/user/decorator';
import { UserDocument } from 'src/user/schemas';
import {
  DiaryDeleteFromListDto,
  DiaryExerciseAddDto,
  DiaryItemDeleteDto,
  DiaryProductAddDto,
} from './dto';
import { Diary } from './schemas';
import { ErrorResponse } from 'src/types';

@ApiBearerAuth('token')
@ApiTags('diary')
@ApiUnauthorizedResponse({ description: 'Not authorized', type: ErrorResponse })
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiOperation({
    description: "Get a page of user's diary on date",
  })
  @Get(':date')
  @ApiOkResponse({ description: 'Successful response', type: Diary })
  @UseGuards(AuthGuard, HasProfileGuard)
  @ApiParam({ name: 'date', description: "Date format 'YYYYMMDD'" })
  diaryByDate(
    @CurrentUser() currentUser: UserDocument,
    @Param('date')
    date: string,
  ) {
    return this.diaryService.diaryByDate(currentUser, date);
  }

  @ApiOperation({
    description:
      "Add data about the consumed product to the user's diary page for the date",
  })
  @Post('/product')
  @ApiCreatedResponse({ description: 'Product added ', type: Diary })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @UseGuards(AuthGuard, HasProfileGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  postProductsToDiary(
    @Body() diaryProductAddDto: DiaryProductAddDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.diaryService.postProductToDiary(
      currentUser,
      diaryProductAddDto,
    );
  }

  @ApiOperation({
    description:
      "Add data about the completed exercise to the user's diary page for the date",
  })
  @Post('/exercise')
  @ApiCreatedResponse({ description: 'Exercise added', type: Diary })
  @ApiNotFoundResponse({ description: 'Exercise not found' })
  @UseGuards(AuthGuard, HasProfileGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  postExerciseToDiary(
    @Body() diaryExerciseAddDto: DiaryExerciseAddDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.diaryService.postExerciseToDiary(
      currentUser,
      diaryExerciseAddDto,
    );
  }

  @ApiOperation({
    description:
      "Delete data about the consumed product from the user's diary page for the date",
  })
  @Delete('/product')
  @ApiOkResponse({ description: 'Product item deleted', type: Diary })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'Dairy page not found',
    type: ErrorResponse,
  })
  @UseGuards(AuthGuard, HasProfileGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async deleteProductFromDiary(
    @CurrentUser() user: UserDocument,
    @Body() dto: DiaryDeleteFromListDto,
  ) {
    return this.diaryService.deleteProductFromDiary(user, dto);
  }

  @ApiOperation({
    description:
      "Delete data about the completed exercise from the user's diary page for the date",
  })
  @Delete('/exercise')
  @ApiOkResponse({ description: 'Exercise item deleted', type: Diary })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'Diary page not found',
    type: ErrorResponse,
  })
  @UseGuards(AuthGuard, HasProfileGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async deleteExerciseFromDiary(
    @CurrentUser() user: UserDocument,
    @Body() dto: DiaryDeleteFromListDto,
  ) {
    return this.diaryService.deleteExerciseFromDiary(user, dto);
  }

  @ApiOperation({
    description:
      "Delete data about the completed exercise or consumed product from the user's diary page for the date",
  })
  @Delete('/item')
  @ApiOkResponse({ description: 'Item deleted', type: Diary })
  @ApiNotFoundResponse({
    description: 'Diary page not found',
    type: ErrorResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponse,
  })
  @UseGuards(AuthGuard, HasProfileGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async deleteFromDiary(
    @CurrentUser() user: UserDocument,
    @Body() dto: DiaryItemDeleteDto,
  ) {
    return this.diaryService.deleteFromDiary(user, dto);
  }
}
