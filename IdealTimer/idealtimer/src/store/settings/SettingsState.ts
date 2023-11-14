import { SidemenuSettings } from "src/app/model/SidemenuSettings";

export interface SettingsState {
    error: any;
    isAddedSettings: boolean;
    isAddingSettings: boolean;

    isRetrievedSettings: boolean;
    isRetrievingSettings: boolean;
    retrievedSettings: SidemenuSettings;

    isUpdatedSettings: boolean;
    isUpdatingSettings: boolean;
}