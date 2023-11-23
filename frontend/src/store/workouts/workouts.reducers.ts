import { createReducer, on } from "@ngrx/store";
import { WorkoutsState } from "./WorkoutsState";
import { addWorkout, addWorkoutFail, addWorkoutSuccess, deleteWorkout, deleteWorkoutFail, deleteWorkoutSuccess, resetAddedWorkoutState, resetDeletedWorkoutState, resetRetrievedWorkoutsData, resetRetrievedWorkoutsState, retrieveWorkouts, retrieveWorkoutsBySplitId, retrieveWorkoutsFail, retrieveWorkoutsSuccess } from "./workouts.actions";
import { AppInitialState } from "../AppInitalState";

const initialState: WorkoutsState = AppInitialState.workouts;

const reducer = createReducer(initialState,
    on(addWorkout, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedWorkout: false,
            isAddingWorkout: true
        };
    }),
    on(addWorkoutSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedWorkout: true,
            isAddingWorkout: false
        };
    }),
    on(addWorkoutFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isAddedWorkout: false,
            isAddingWorkout: false
        };
    }),
    on(resetAddedWorkoutState, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedWorkout: false
        };
    }),


    on(deleteWorkout, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedWorkout: false,
            isDeletingWorkout: true
        };
    }),
    on(deleteWorkoutSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedWorkout: true,
            isDeletingWorkout: false
        };
    }),
    on(deleteWorkoutFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isDeletedWorkout: false,
            isDeletingWorkout: false
        };
    }),
    on(resetDeletedWorkoutState, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedWorkout: false
        };
    }),


    on(retrieveWorkouts, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedWorkouts: false,
            isRetrievingWorkouts: true
        };
    }),
    on(retrieveWorkoutsBySplitId, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedWorkouts: false,
            isRetrievingWorkouts: true
        };
    }),
    on(retrieveWorkoutsSuccess, (currentState, {workoutInstances}) => {
        return {
            ...currentState,
            error: null,
            isRetrievedWorkouts: true,
            isRetrievingWorkouts: false,
            retrievedWorkouts: workoutInstances
        };
    }),
    on(retrieveWorkoutsFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isRetrievedWorkouts: false,
            isRetrievingWorkouts: false
        };
    }),
    on(resetRetrievedWorkoutsState, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedWorkouts: false,
        };
    }),
    on(resetRetrievedWorkoutsData, currentState => {
        return {
            ...currentState,
            error: null,
            retrievedWorkouts: []
        };
    }),
)

export function workoutsReducer(state: WorkoutsState | undefined, action: any) {
    return reducer(state, action);
}