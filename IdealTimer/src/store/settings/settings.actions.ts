import { createAction, props } from "@ngrx/store";
import { SidemenuSettings } from "src/app/model/SidemenuSettings";

export const addDefaultSettings = createAction("[Add Settings]", props<{darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string}>());
export const addDefaultSettingsSuccess = createAction("[Add Settings] Success");
export const addDefaultSettingsFail = createAction("[Add Settings] Fail", props<{error: any}>());
export const resetAddedDefaultSettingsState = createAction('[Settings] Reset addDefaultSettings State');

export const retrieveSettings = createAction("[Retrieve Settings]");
export const retrieveSettingsSuccess = createAction("[Retrieve Settings] Success", props<{settings: SidemenuSettings}>());
export const retrieveSettingsFail = createAction("[Retrieve Settings] Fail", props<{error: any}>());
export const resetRetrievedSettingsState = createAction('[Settings] Reset retrieveSettings State');
export const resetRetrievedSettingsData = createAction('[Settings] Reset retrieveSettings Data');

export const updateSettings = createAction("[Update Settings]", props<{darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string}>());
export const updateSettingsSuccess = createAction("[Update Settings] Success");
export const updateSettingsFail = createAction("[Update Settings] Fail", props<{error: any}>());
export const resetUpdatedSettingsState = createAction('[Settings] Reset updateSettings State');