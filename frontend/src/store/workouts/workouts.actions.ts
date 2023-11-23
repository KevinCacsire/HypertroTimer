import { createAction, props } from "@ngrx/store";
import { Exercise } from "src/app/model/Exercise";
import { WorkoutInstance } from "src/app/model/WorkoutInstance";

export const addWorkout = createAction("[Add Workout]", props<{exercisesVolume: Exercise[], startingDate: Date, endingDate: Date,
    splitId: string, splitName: string, sessionId: string, sessionName: string}>());
export const addWorkoutSuccess = createAction("[Add Workout] Success");
export const addWorkoutFail = createAction("[Add Workout] Fail", props<{error: any}>());
export const resetAddedWorkoutState = createAction('[Workout] Reset addWorkout State');

export const deleteWorkout = createAction("[Delete Workout]", props<{workoutId: string}>());
export const deleteWorkoutSuccess = createAction("[Delete Workout] Success");
export const deleteWorkoutFail = createAction("[Delete Workout] Fail", props<{error: any}>());
export const resetDeletedWorkoutState = createAction('[Workout] Reset deleteWorkout State');

export const retrieveWorkouts = createAction("[Retrieve Workouts]");
export const retrieveWorkoutsBySplitId  = createAction("[Retrieve Workouts By ID]", props<{splitId: string}>());
export const retrieveWorkoutsSuccess = createAction("[Retrieve Workouts] Success", props<{workoutInstances: WorkoutInstance[]}>());
export const retrieveWorkoutsFail = createAction("[Retrieve Workouts] Fail", props<{error: any}>());
export const resetRetrievedWorkoutsState = createAction('[Workout] Reset retrieveWorkouts State');
export const resetRetrievedWorkoutsData = createAction('[Workout] Reset retrieveWorkouts Data');