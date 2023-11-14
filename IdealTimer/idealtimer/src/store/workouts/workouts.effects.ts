import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addWorkout, addWorkoutFail, addWorkoutSuccess, deleteWorkout, deleteWorkoutFail, deleteWorkoutSuccess, retrieveWorkouts, retrieveWorkoutsBySplitId, retrieveWorkoutsFail, retrieveWorkoutsSuccess } from "./workouts.actions";
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { WorkoutService } from "src/app/services/workout.service";
import { Exercise } from "src/app/model/Exercise";

@Injectable()
export class WorkoutsEffects {

    constructor(private actions$: Actions, private workoutService: WorkoutService) {}

    addWorkout$ = createEffect(() => this.actions$.pipe(
        ofType(addWorkout),
        switchMap((payload: {exercisesVolume: Exercise[], startingDate: Date, endingDate: Date, splitId: string, splitName: string, sessionId: string, sessionName: string}) =>
            this.workoutService.postWorkout(payload.exercisesVolume, payload.startingDate, payload.endingDate, payload.splitId, payload.splitName, payload.sessionId, payload.sessionName).pipe(
                map(() => addWorkoutSuccess()),
                catchError(error => of(addWorkoutFail({error})))
            )
        )
    ))

    deleteWorkout$ = createEffect(() => this.actions$.pipe(
        ofType(deleteWorkout),
        switchMap((payload: {workoutId: string}) =>
            this.workoutService.deleteWorkout(payload.workoutId).pipe(
                map(() => deleteWorkoutSuccess()),
                catchError(error => of(deleteWorkoutFail({error})))
            )
        )
    ))

    retrieveWorkouts$ = createEffect(() => this.actions$.pipe(
        ofType(retrieveWorkouts),
        switchMap(() =>
            this.workoutService.getWorkouts().pipe(
                map(workoutInstances => retrieveWorkoutsSuccess({workoutInstances})),
                catchError(error => of(retrieveWorkoutsFail({error})))
            )
        )
    ))

    retrieveWorkoutsBySplitId$ = createEffect(() => this.actions$.pipe(
        ofType(retrieveWorkoutsBySplitId),
        switchMap((payload: {splitId: string}) =>
            this.workoutService.getWorkoutsBySplitId(payload.splitId).pipe(
                map(workoutInstances => retrieveWorkoutsSuccess({workoutInstances})),
                catchError(error => of(retrieveWorkoutsFail({error})))
            )
        )
    ))
}