import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addSession, addSessionFail, addSessionSuccess, deleteSession, deleteSessionFail,
    deleteSessionSuccess,  retrieveSessions, retrieveSessionsFail, retrieveSessionsSuccess,
    updateSession, updateSessionFail, updateSessionSuccess } from "./logging.sessions.actions";
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SessionService } from "src/app/services/session.service";

@Injectable()
export class LoggingSessionsEffects {

    constructor(private actions$: Actions, private sessionService: SessionService) {}

    addSession$ = createEffect(() => this.actions$.pipe(
        ofType(addSession),
        switchMap((payload: {sessionName: string, weekday: string, splitId: string}) =>
            this.sessionService.postSession(payload.sessionName, payload.weekday, payload.splitId).pipe(
                map(() => addSessionSuccess()),
                catchError(error => of(addSessionFail({error})))
            )
        )
    ))

    deleteSession$ = createEffect(() => this.actions$.pipe(
        ofType(deleteSession),
        switchMap((payload: {splitId: string, sessionId: string}) =>
            this.sessionService.deleteSession(payload.splitId, payload.sessionId).pipe(
                map(() => deleteSessionSuccess()),
                catchError(error => of(deleteSessionFail({error})))
            )
        )
    ))
    
    retrieveSessions$ = createEffect(() => this.actions$.pipe(
        ofType(retrieveSessions),
        switchMap((payload: {splitId: string}) =>
            this.sessionService.getSessions(payload.splitId).pipe(
                map(sessions => retrieveSessionsSuccess({sessions})),
                catchError(error => of(retrieveSessionsFail({error})))
            )
        )
    ))
    
    updateSession$ = createEffect(() => this.actions$.pipe(
        ofType(updateSession),
        switchMap((payload: {sessionName: string, weekday: string, splitId: string, sessionId: string}) =>
            this.sessionService.putSession(payload.sessionName, payload.weekday, payload.splitId, payload.sessionId).pipe(
                map(() => updateSessionSuccess()),
                catchError(error => of(updateSessionFail({error})))
            )
        )
    ))
}