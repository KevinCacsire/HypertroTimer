import { Exercise } from "./Exercise";

export class WorkoutInstance {
  exercisesVolumes: Exercise[] = [];
  workoutId?: string;
  startingDate?: Date;
  endingDate?: Date;
  sessionId?: string;
  sessionName?: string;
  splitId?: string;
  splitName?: string;
}