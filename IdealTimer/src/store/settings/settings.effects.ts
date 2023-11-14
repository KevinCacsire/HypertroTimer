import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SettingsService } from "src/app/services/settings.service";
import { addDefaultSettings, addDefaultSettingsFail, addDefaultSettingsSuccess, retrieveSettings, retrieveSettingsFail, retrieveSettingsSuccess, updateSettings, updateSettingsFail, updateSettingsSuccess } from "./settings.actions";

@Injectable()
export class SettingsEffects {

    constructor(private actions$: Actions, private settingsService: SettingsService) {}

    addSettings$ = createEffect(() => this.actions$.pipe(
        ofType(addDefaultSettings),
        switchMap((payload: {darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string}) =>
            this.settingsService.postDefaultSettings(payload.darkmode, payload.audioOn, payload.volume, payload.selectedAudioFile).pipe(
                map(() => addDefaultSettingsSuccess()),
                catchError(error => of(addDefaultSettingsFail({error})))
            )
        )
    ))

    retrieveSettings$ = createEffect(() => this.actions$.pipe(
        ofType(retrieveSettings),
        switchMap(() =>
            this.settingsService.getSettings().pipe(
                map(settings => retrieveSettingsSuccess({settings})),
                catchError(error => of(retrieveSettingsFail({error})))
            )
        )
    ))

    updateSettings$ = createEffect(() => this.actions$.pipe(
        ofType(updateSettings),
        switchMap((payload: {darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string}) =>
            this.settingsService.putSettings(payload.darkmode, payload.audioOn, payload.volume, payload.selectedAudioFile).pipe(
                map(() => updateSettingsSuccess()),
                catchError(error => of(updateSettingsFail({error})))
            )
        )
    ))
}