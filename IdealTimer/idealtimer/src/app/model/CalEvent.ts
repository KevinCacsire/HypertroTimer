import { WorkoutInstance } from "./WorkoutInstance";

export class CalEvent {
  title?: string;
  startTime?: Date;
  endTime?: Date;
  allDay?: boolean;
  workoutInstance?: WorkoutInstance 
}