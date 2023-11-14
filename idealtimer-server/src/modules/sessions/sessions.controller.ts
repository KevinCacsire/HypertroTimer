import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { Session } from '../../model/session';

@Controller('users/:userId/splits')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get(':splitId/sessions')
  getSessions(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
  ) : Promise<Session[]> {
    return this.sessionsService.getSessions(userId, splitId);
  }

  @Post(':splitId/sessions')
  async postSession(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
    @Body() body: {sessionName: string, weekday: string}
  ) : Promise<void> {
    await this.sessionsService.postSession(userId, splitId, body.sessionName, body.weekday);
  }

  @Delete(':splitId/sessions/:sessionId')
  async deleteSession(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
    @Param('sessionId') sessionId: string,
  ) : Promise<void> {
    await this.sessionsService.deleteSession(userId, splitId, sessionId);
  }

  @Put(':splitId/sessions/:sessionId')
  async updateSession(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
    @Param('sessionId') sessionId: string,
    @Body() body: { sessionName: string, weekday: number }
  ) : Promise<void> {
    await this.sessionsService.updateSession(userId, splitId, sessionId, body.sessionName, body.weekday);
  }
}
