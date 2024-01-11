import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatsResponse } from './dto/responses';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @ApiOperation({
    summary: 'Get total statistics',
    description: 'Get total statistics',
  })
  @Get()
  @ApiOkResponse({ description: 'Successful response', type: StatsResponse })
  async getStats(): Promise<StatsResponse> {
    return this.statsService.getStats();
  }
}
