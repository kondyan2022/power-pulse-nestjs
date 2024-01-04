import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiaryService } from './diary.service';
import { AuthGuard, HasProfileGuard } from 'src/user/guards';
import { CurrentUser } from 'src/user/decorator';
import { UserDocument } from 'src/user/schemas';

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
}
