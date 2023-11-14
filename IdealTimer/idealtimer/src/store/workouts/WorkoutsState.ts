import { WorkoutInstance } from "src/app/model/WorkoutInstance";

export interface WorkoutsState {
    error: any;
    isAddedWorkout: boolean;
    isAddingWorkout: boolean;
    
    isDeletedWorkout: boolean;
    isDeletingWorkout: boolean;

    isRetrievedWorkouts: boolean;
    isRetrievingWorkouts: boolean;
    retrievedWorkouts: WorkoutInstance[];
}