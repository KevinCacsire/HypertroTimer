import { createReducer, on } from "@ngrx/store";
import { AppInitialState } from "../AppInitalState";
import { SettingsState } from "./SettingsState";
import { addDefaultSettings, addDefaultSettingsFail, addDefaultSettingsSuccess,
    resetAddedDefaultSettingsState, resetRetrievedSettingsData, resetRetrievedSettingsState, resetUpdatedSettingsState, retrieveSettings,
    retrieveSettingsFail, retrieveSettingsSuccess, updateSettingsFail, updateSettingsSuccess } from "./settings.actions";

const initialState: SettingsState = AppInitialState.settings;

const reducer = createReducer(initialState,
    on(addDefaultSettings, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedSettings: false,
            isAddingSettings: true
        };
    }),
    on(addDefaultSettingsSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedSettings: true,
            isAddingSettings: false
        };
    }),
    on(addDefaultSettingsFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isAddedSettings: false,
            isAddingSettings: false
        };
    }),
    on(resetAddedDefaultSettingsState, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedSettings: false
        };
    }),


    on(retrieveSettings, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedSettings: false,
            isRetrievingSettings: true
        };
    }),
    on(retrieveSettingsSuccess, (currentState, {settings}) => {
        return {
            ...currentState,
            error: null,
            isRetrievedSettings: true,
            isRetrievingSettings: false,
            retrievedSettings: settings
        };
    }),
    on(retrieveSettingsFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isRetrievedSettings: false,
            isRetrievingSettings: false
        };
    }),
    on(resetRetrievedSettingsState, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedSettings: false,
        };
    }),
    on(resetRetrievedSettingsData, currentState => {
        return {
            ...currentState,
            error: null,
            retrievedSettings: {}
        };
    }),


    on(updateSettingsFail, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedSettings: false,
            isUpdatingSettings: true
        };
    }),
    on(updateSettingsSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedSettings: true,
            isUpdatingSettings: false,
        };
    }),
    on(updateSettingsFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isUpdatedSettings: false,
            isUpdatingSettings: false
        };
    }),
    on(resetUpdatedSettingsState, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedSettings: false
        };
    }),
)

export function settingsReducer(state: SettingsState | undefined, action: any) {
    return reducer(state, action);
}