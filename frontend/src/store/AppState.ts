import { LoadingState } from "./loading/LoadingState";
import { LoggingSessionsState } from "./logging-sessions/LoggingSessionsState";
import { LoggingSplitsState } from "./logging-splits/LoggingSplitsState";
import { LoggingExercisesState } from "./logging-exercises/LoggingExercisesState";
import { LoginState } from "./login/LoginState";
import { WorkoutsState } from "./workouts/WorkoutsState";
import { SettingsState } from "./settings/SettingsState";

export interface AppState {
    loading: LoadingState;
    loggingSplits: LoggingSplitsState,
    loggingSessions: LoggingSessionsState,
    loggingExercises: LoggingExercisesState,
    workouts: WorkoutsState
    login: LoginState;
    settings: SettingsState
}