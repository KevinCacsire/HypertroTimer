import { Body, Controller, Post, Get, Param, Delete, Put} from '@nestjs/common';
import { SplitsService } from './splits.service';
import { Split } from '../../model/split';

@Controller('users')
export class SplitsController {
  constructor(private readonly splitsService: SplitsService) {}

  @Get(':userId/splits')
  getSplits(
    @Param('userId') userId: string
  ): Promise<Split[]> {
    return this.splitsService.getSplits(userId);
  }

  @Post(':userId/splits')
  async addSplit(
    @Param('userId') userId: string,
    @Body() body: { splitName: string, sessionsAmount: number }
  ): Promise<void> {
    await this.splitsService.postSplit(userId, body.splitName, body.sessionsAmount);
  }

  @Delete(':userId/splits/:splitId')
  async deleteSplit(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string
  ): Promise<void> {
    await this.splitsService.deleteSplit(userId, splitId);
  }
  
  @Put(':userId/splits/:splitId')
  async updateSplit(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
    @Body() body: { splitName: string, sessionsAmount: number }
  ): Promise<void> {
    await this.splitsService.updateSplit(userId, splitId, body.splitName, body.sessionsAmount);
  }
}
