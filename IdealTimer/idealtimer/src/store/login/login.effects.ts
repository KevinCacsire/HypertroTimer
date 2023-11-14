import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { deleteAccount, deleteAccountFail, deleteAccountSuccess, login, loginFail, loginSuccess, logout, logoutFail, logoutSuccess, recoverPassword, recoverPasswordFail,
    recoverPasswordSuccess, register, registerFail, registerSuccess } from "./login.actions";
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from "src/app/services/auth.service";
import { of } from 'rxjs';
import { UserRegister } from "src/app/model/UserRegister";
import { Router } from "@angular/router";
import { Store } from '@ngrx/store';
import { AppState } from 'src/store/AppState';
import { resetRetrievedSplitsData } from "../logging-splits/logging.splits.actions";
import { resetRetrievedSessionsData } from "../logging-sessions/logging.sessions.actions";
import { resetRetrievedExercisesData } from "../logging-exercises/logging.exercises.actions";
import { resetRetrievedWorkoutsData } from "../workouts/workouts.actions";
import { resetRetrievedSettingsData } from "../settings/settings.actions";

@Injectable()
export class LoginEffects {

    constructor(private actions$: Actions, private authService: AuthService,
        private router: Router, private store: Store<AppState>) {}

    recoverPassword$ = createEffect(() => this.actions$.pipe(
        ofType(recoverPassword),
        switchMap((payload: {email: string}) =>
            this.authService.recoverEmailPassword(payload.email).pipe(
                map(() => recoverPasswordSuccess()),
                catchError(error => {
                    let errorMessage: string;
            
                    if (error.code === 'auth/user-not-found') {
                      errorMessage = 'No user found with this email address.';
                    } else if (error.code === 'auth/invalid-email') {
                      errorMessage = 'Invalid email address. Please check and try again.';
                    } else if (error.code === 'auth/too-many-requests') {
                      errorMessage = 'Too many unsuccessful attempts. Please try again later.';
                    } else {
                      errorMessage = 'An unknown error occurred. Please try again later.';
                    }
            
                    return of(recoverPasswordFail({ error: { ...error, message: errorMessage } }));
                  })
            )
        )
    ))

    login$ = createEffect(() => this.actions$.pipe(
        ofType(login),
        switchMap((payload: {email: string, password: string}) =>
            this.authService.login(payload.email, payload.password).pipe(
                map(user => loginSuccess({user})),
                catchError(error => {
                    let errorMessage: string;
                    if (error.code === 'auth/user-not-found') {
                        errorMessage = 'User not found. Please register first.';
                    } else if (error.code === 'auth/wrong-password') {
                        errorMessage = 'Incorrect password. Please try again.';
                    } else if (error.code === 'auth/too-many-requests') {
                        errorMessage = 'Too many requests. Please reset your password.';
                    } else {
                        errorMessage = 'An unknown error occurred. Please try again later.';
                    }

                    return of(loginFail({ error: { ...error, message: errorMessage }}));
                })
            )
        )
    ))

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(logout),
        switchMap(() =>
            this.authService.logout().pipe(
                map(() => logoutSuccess()),
                catchError(error => {
                    
                    let errorMessage: string;
                    if (error.code === 'auth/user-not-found') {
                      errorMessage = 'User not found.';
                    } else if (error.code === 'auth/unauthorized-operation') {
                      errorMessage = 'Unauthorized operation.';
                    } else {
                        errorMessage = 'An unknown error occurred. Please try again later.';
                    }
                    
                    return of(logoutFail({ error: { ...error, message: errorMessage } }));
                  })
            )
        )
    ));

    logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutSuccess),
      tap(() => {
        
        this.store.dispatch(resetRetrievedSplitsData());
        this.store.dispatch(resetRetrievedSessionsData());
        this.store.dispatch(resetRetrievedExercisesData());
        this.store.dispatch(resetRetrievedWorkoutsData());
        this.store.dispatch(resetRetrievedSettingsData());

        this.router.navigate(['login'], { replaceUrl: true });

      })
    ), { dispatch: false }
    );

    register$ = createEffect(() => this.actions$.pipe(
        ofType(register),
        switchMap((payload: {userRegister: UserRegister}) =>
            this.authService.register(payload.userRegister).pipe(
                map(() => registerSuccess()),
                catchError(error => {
                    let errorMessage: string;
                    if (error.code === 'auth/email-already-in-use') {
                        errorMessage = 'Email is already registered. Either login or reset password.';
                    } else if (error.code === 'auth/invalid-email') {
                        errorMessage = 'Invalid email address. Please check and try again.';
                    } else {
                        errorMessage = 'An unknown error occurred. Please try again later.';
                    }

                    return of(registerFail({ error: { ...error, message: errorMessage }}));
                })
            )
        )
    ))

    deleteAccount$ = createEffect(() => this.actions$.pipe(
        ofType(deleteAccount),
        switchMap(() =>
            this.authService.deleteAccount().pipe(
                map(() => deleteAccountSuccess()),
                catchError(error => of(deleteAccountFail({ error })))
            )
        )
    ));
}