import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addSplit, addSplitFail, addSplitSuccess, deleteSplit, deleteSplitFail,
    deleteSplitSuccess, retrieveSplits, retrieveSplitsFail,retrieveSplitsSuccess,
    updateSplit, updateSplitFail, updateSplitSuccess } from "./logging.splits.actions";
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SplitService } from "src/app/services/split.service";

@Injectable()
export class LoggingSplitsEffects {

    constructor(private actions$: Actions, private splitService: SplitService) {}

    addSplit$ = createEffect(() => this.actions$.pipe(
        ofType(addSplit),
        switchMap((payload: {splitName: string, sessionsAmount: string}) =>
            this.splitService.postSplit(payload.splitName, payload.sessionsAmount).pipe(
                map(() => addSplitSuccess()),
                catchError(error => of(addSplitFail({error})))
            )
        )
    ))

    deleteSplit$ = createEffect(() => this.actions$.pipe(
        ofType(deleteSplit),
        switchMap((payload: {splitId: string}) =>
            this.splitService.deleteSplit(payload.splitId).pipe(
                map(() => deleteSplitSuccess()),
                catchError(error => of(deleteSplitFail({error})))
            )
        )
    ))

    retrieveSplits$ = createEffect(() => this.actions$.pipe(
        ofType(retrieveSplits),
        switchMap(() =>
            this.splitService.getSplits().pipe(
                map(splits => retrieveSplitsSuccess({splits})),
                catchError(error => of(retrieveSplitsFail({error})))
            )
        )
    ))

    updateSplit$ = createEffect(() => this.actions$.pipe(
        ofType(updateSplit),
        switchMap((payload: {splitName: string, sessionsAmount: string, splitId: string}) =>
            this.splitService.putSplit(payload.splitName, payload.sessionsAmount, payload.splitId).pipe(
                map(() => updateSplitSuccess()),
                catchError(error => of(updateSplitFail({error})))
            )
        )
    ))
}