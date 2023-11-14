import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { Exercise } from '../../model/exercise';
import { WorkoutInstance } from '../../model/WorkoutInstance';

@Controller('users')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get(':userId/workouts')
  getWorkouts(
    @Param('userId') userId: string,
  ) : Promise<WorkoutInstance[]> {
    return this.workoutsService.getWorkouts(userId);
  }

  @Get(':userId/workouts/:splitId')
  getWorkoutsBySplitId(
    @Param('userId') userId: string,
    @Param('splitId') splitId: string,
  ) : Promise<WorkoutInstance[]> {
    return this.workoutsService.getUniqueRecentWorkoutsBySplitId(userId, splitId);
  }

  @Post(':userId/workouts')
  async postWorkout(
    @Param('userId') userId: string,
    @Body() body: { exercisesVolume: Exercise[], startingDate: Date, endingDate: Date, splitId: string, splitName: string, sessionId: string, sessionName: string}
  ) : Promise<void> {
    await this.workoutsService.postWorkout(userId, body.exercisesVolume, body.startingDate, body.endingDate, body.splitId, body.splitName, body.sessionId, body.sessionName);
  }
  
  @Delete(':userId/workouts/:workoutId')
  async deleteWorkout(
    @Param('userId') userId: string,
    @Param('workoutId') splitId: string
  ): Promise<void> {
    await this.workoutsService.deleteWorkout(userId, splitId);
  }
}
