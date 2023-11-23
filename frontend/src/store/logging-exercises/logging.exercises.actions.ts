import { createAction, props } from "@ngrx/store";
import { Exercise } from "src/app/model/Exercise";

export const addExercise = createAction("[Add Exercise]", props<{exerciseName: string, exerciseType: string, indexOrder: number, splitId: string, sessionId: string}>());
export const addExerciseSuccess = createAction("[Add Exercise] Success");
export const addExerciseFail = createAction("[Add Exercise] Fail", props<{error: any}>());
export const resetAddedExerciseState = createAction('[Exercise] Reset addExercise State');

export const deleteExercise = createAction("[Delete Exercise]", props<{splitId: string, sessionId: string, exerciseId: string}>());
export const deleteExerciseSuccess = createAction("[Delete Exercise] Success");
export const deleteExerciseFail = createAction("[Delete Exercise] Fail", props<{error: any}>());
export const resetDeletedExerciseState = createAction('[Exercise] Reset deleteExercise State');

export const retrieveExercises = createAction("[Retrieve Exercises]", props<{splitId: string, sessionId: string}>());
export const retrieveExercisesSuccess = createAction("[Retrieve Exercises] Success", props<{exercises: Exercise[]}>());
export const retrieveExercisesFail = createAction("[Retrieve Exercises] Fail", props<{error: any}>());
export const resetRetrievedExercisesState = createAction('[Exercise] Reset retrieveExercises State');
export const resetRetrievedExercisesData = createAction('[Exercise] Reset retrieveExercises Data');

export const updateExercise = createAction("[Update Exercise]", props<{exerciseName: string, exerciseType: string, indexOrder: number, splitId: string, sessionId: string, exerciseId: string}>());
export const updateExerciseSuccess = createAction("[Update Exercise] Success");
export const updateExerciseFail = createAction("[Update Exercise] Fail", props<{error: any}>());
export const resetUpdatedExerciseState = createAction('[Exercise] Reset updateExercise State');

export const updateExercises = createAction("[Update Exercises]", props<{exercises: Exercise[], splitId: string, sessionId: string}>());
export const updateExercisesSuccess = createAction("[Update Exercises] Success");
export const updateExercisesFail = createAction("[Update Exercises] Fail", props<{error: any}>());
export const resetUpdatedExercisesState = createAction('[Exercises] Reset updateExercises State');