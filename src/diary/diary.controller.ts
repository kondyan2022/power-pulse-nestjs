import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiaryService } from './diary.service';
import { AuthGuard, HasProfileGuard } from 'src/user/guards';
import { CurrentUser } from 'src/user/decorator';
import { UserDocument } from 'src/user/schemas';
import { DiaryProductAddDto } from './dto';

@ApiBearerAuth('token')
@ApiTags('diary')
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}
  @Get(':date')
  @UseGuards(AuthGuard)
  @UseGuards(HasProfileGuard)
  diaryByDate(
    @CurrentUser() currentUser: UserDocument,
    @Param('date') date: string,
  ) {
    return this.diaryService.diaryByDate(currentUser, date);
  }

  @Post('/product')
  @UseGuards(AuthGuard)
  @UseGuards(HasProfileGuard)
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
    return this.diaryService.postProductsToDiary(
      currentUser,
      diaryProductAddDto,
    );
  }
}
