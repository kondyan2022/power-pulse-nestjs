import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @ApiOperation({
    description: 'Get total statistics',
  })
  @Get()
  async getStats() {
    return this.statsService.getStats();
  }
}
