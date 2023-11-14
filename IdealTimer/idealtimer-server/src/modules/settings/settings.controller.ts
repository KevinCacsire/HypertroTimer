import { Body, Controller, Post, Get, Param, Put} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Settings } from '../../model/settings';

@Controller('users')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':userId/settings')
  getSettings(
    @Param('userId') userId: string
  ): Promise<Settings> {
    return this.settingsService.getSettings(userId);
  }

  @Post(':userId/settings')
  async addSettings(
    @Param('userId') userId: string,
    @Body() body: { darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string }
  ): Promise<void> {
    await this.settingsService.postSettings(userId, body.darkmode, body.audioOn, body.volume, body.selectedAudioFile);
  }

  @Put(':userId/settings')
  async updateSettings(
    @Param('userId') userId: string,
    @Body() body: { darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string }
  ): Promise<void> {
    await this.settingsService.updateSettings(userId, body.darkmode, body.audioOn, body.volume, body.selectedAudioFile);
  }
}
