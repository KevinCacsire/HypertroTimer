import { Exercise } from "src/app/model/Exercise";

export interface LoggingExercisesState {
    error: any;
    isAddedExercise: boolean;
    isAddingExercise: boolean;
    
    isDeletedExercise: boolean;
    isDeletingExercise: boolean;

    isRetrievedExercises: boolean;
    isRetrievingExercises: boolean;
    retrievedExercises: Exercise[];

    isUpdatedExercise: boolean;
    isUpdatingExercise: boolean;
    
    isUpdatedExercises: boolean;
    isUpdatingExercises: boolean;
}