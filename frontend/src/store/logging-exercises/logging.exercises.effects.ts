import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addExercise, addExerciseFail, addExerciseSuccess, deleteExercise, deleteExerciseFail,
    deleteExerciseSuccess, retrieveExercises, retrieveExercisesFail, retrieveExercisesSuccess,
    updateExercise, updateExerciseFail, updateExerciseSuccess, updateExercises, updateExercisesFail, updateExercisesSuccess } from "./logging.exercises.actions";
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ExerciseService } from "src/app/services/exercise.service";
import { Exercise } from "src/app/model/Exercise";

@Injectable()
export class LoggingExercisesEffects {

    constructor(private actions$: Actions, private exerciseService: ExerciseService) {}

    addExercise$ = createEffect(() => this.actions$.pipe(
        ofType(addExercise),
        switchMap((payload: {exerciseName: string, exerciseType: string, indexOrder: number, splitId: string, sessionId: string}) =>
            this.exerciseService.postExercise(payload.exerciseName, payload.exerciseType, payload.indexOrder, payload.splitId, payload.sessionId).pipe(
                map(() => addExerciseSuccess()),
                catchError(error => of(addExerciseFail({error})))
            )
        )
    ))

    deleteExercise$ = createEffect(() => this.actions$.pipe(
        ofType(deleteExercise),
        switchMap((payload: {splitId: string, sessionId: string, exerciseId: string}) =>
            this.exerciseService.deleteExercise(payload.splitId, payload.sessionId, payload.exerciseId).pipe(
                map(() => deleteExerciseSuccess()),
                catchError(error => of(deleteExerciseFail({error})))
            )
        )
    ))

    retrieveExercises$ = createEffect(() => this.actions$.pipe(
        ofType(retrieveExercises),
        switchMap((payload: {splitId: string, sessionId: string}) =>
            this.exerciseService.getExercises(payload.splitId, payload.sessionId).pipe(
                map(exercises => retrieveExercisesSuccess({exercises})),
                catchError(error => of(retrieveExercisesFail({error})))
            )
        )
    ))

    updateExercise$ = createEffect(() => this.actions$.pipe(
        ofType(updateExercise),
        switchMap((payload: {exerciseName: string, exerciseType: string, indexOrder: number, splitId: string, sessionId: string, exerciseId: string}) =>
            this.exerciseService.putExercise(payload.exerciseName, payload.exerciseType, payload.indexOrder, payload.splitId, payload.sessionId, payload.exerciseId).pipe(
                map(() => updateExerciseSuccess()),
                catchError(error => of(updateExerciseFail({error})))
            )
        )
    ))

    updateExercises$ = createEffect(() => this.actions$.pipe(
        ofType(updateExercises),
        switchMap((payload: {exercises: Exercise[], splitId: string, sessionId: string}) =>
            this.exerciseService.putExercises(payload.exercises, payload.splitId, payload.sessionId).pipe(
                map(() => updateExercisesSuccess()),
                catchError(error => of(updateExercisesFail({error})))
            )
        )
    ))
}