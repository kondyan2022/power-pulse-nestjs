import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('diary')
@Controller('diary')
export class DiaryController {}
