import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { Exercise } from '../../model/exercise';

@Controller('users/:userId/splits/:splitId/sessions')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get(':sessionId/exercises')
  getSessions(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
    @Param('sessionId') sessionId: string,
  ) : Promise<Exercise[]> {
    return this.exercisesService.getExercises(userId, splitId, sessionId);
  }

  @Post(':sessionId/exercises')
  async postSession(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
    @Param('sessionId') sessionId: string,
    @Body() body: { exerciseName: string, exerciseType: string, indexOrder: number }
  ) : Promise<void> {
    await this.exercisesService.postExercise(userId, splitId, sessionId, body.exerciseName, body.exerciseType, body.indexOrder);
  }

  @Delete(':sessionId/exercises/:exerciseId')
  async deleteSession(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
    @Param('sessionId') sessionId: string,
    @Param('exerciseId') exerciseId: string,
  ) : Promise<void> {
    await this.exercisesService.deleteExercise(userId, splitId, sessionId, exerciseId);
  }

  @Put(':sessionId/exercises/:exerciseId')
  async updateSession(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
    @Param('sessionId') sessionId: string,
    @Param('exerciseId') exerciseId: string,
    @Body() body: { exerciseName: string, exerciseType: string, indexOrder: number }
  ) : Promise<void> {
    await this.exercisesService.updateExercise(userId, splitId, sessionId, exerciseId, body.exerciseName, body.exerciseType, body.indexOrder);
  }
}
