import { createReducer, on } from "@ngrx/store";
import { LoggingExercisesState } from "./LoggingExercisesState";
import { addExercise, addExerciseFail, addExerciseSuccess, deleteExercise, deleteExerciseFail,
    deleteExerciseSuccess, resetAddedExerciseState, resetDeletedExerciseState, resetRetrievedExercisesData, resetRetrievedExercisesState,
    resetUpdatedExerciseState,  retrieveExercises, retrieveExercisesFail, retrieveExercisesSuccess,  
    updateExercise, updateExerciseFail, updateExerciseSuccess,
    } from "./logging.exercises.actions";
import { AppInitialState } from "../AppInitalState";

const initialState: LoggingExercisesState = AppInitialState.loggingExercises;

const reducer = createReducer(initialState,
    on(addExercise, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedExercise: false,
            isAddingExercise: true
        };
    }),
    on(addExerciseSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedExercise: true,
            isAddingExercise: false
        };
    }),
    on(addExerciseFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isAddedExercise: false,
            isAddingExercise: false
        };
    }),
    on(resetAddedExerciseState, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedExercise: false
        };
    }),


    on(deleteExercise, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedExercise: false,
            isDeletingExercise: true
        };
    }),
    on(deleteExerciseSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedExercise: true,
            isDeletingExercise: false
        };
    }),
    on(deleteExerciseFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isDeletedExercise: false,
            isDeletingExercise: false
        };
    }),
    on(resetDeletedExerciseState, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedExercise: false
        };
    }),


    on(retrieveExercises, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedExercises: false,
            isRetrievingExercises: true
        };
    }),
    on(retrieveExercisesSuccess, (currentState, {exercises}) => {
        return {
            ...currentState,
            error: null,
            isRetrievedExercises: true,
            isRetrievingExercises: false,
            retrievedExercises: exercises
        };
    }),
    on(retrieveExercisesFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isRetrievedExercises: false,
            isRetrievingExercises: false
        };
    }),
    on(resetRetrievedExercisesState, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedExercises: false,
        };
    }),
    on(resetRetrievedExercisesData, currentState => {
        return {
            ...currentState,
            error: null,
            retrievedExercises: []
        };
    }),


    on(updateExercise, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedExercise: false,
            isUpdatingExercise: true
        };
    }),
    on(updateExerciseSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedExercise: true,
            isUpdatingExercise: false,
        };
    }),
    on(updateExerciseFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isUpdatedExercise: false,
            isUpdatingExercise: false
        };
    }),
    on(resetUpdatedExerciseState, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedExercise: false
        };
    }),
)

export function loggingExercisesReducer(state: LoggingExercisesState | undefined, action: any) {
    return reducer(state, action);
}