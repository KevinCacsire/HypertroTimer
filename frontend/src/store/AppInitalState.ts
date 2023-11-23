import { SidemenuSettings } from "src/app/model/SidemenuSettings";
import { AppState } from "./AppState";

export const AppInitialState: AppState = {
    loading: {
        show: false
    },
    loggingSplits: {
        error: null,
        isAddedSplit: false,
        isAddingSplit: false,
        isDeletedSplit: false,
        isDeletingSplit: false,
        isRetrievingSplits: false,
        isRetrievedSplits: false,
        retrievedSplits: [],
        isUpdatedSplit: false,
        isUpdatingSplit: false
    },
    loggingSessions: {
        error: null,
        isAddedSession: false,
        isAddingSession: false,
        isDeletedSession: false,
        isDeletingSession: false,
        isRetrievingSessions: false,
        isRetrievedSessions: false,
        retrievedSessions: [],
        isUpdatedSession: false,
        isUpdatingSession: false,
    },
    loggingExercises: {
        error: null,
        isAddedExercise: false,
        isAddingExercise: false,
        isDeletedExercise: false,
        isDeletingExercise: false,
        isRetrievedExercises: false,
        isRetrievingExercises: false,
        retrievedExercises: [],
        isUpdatedExercise: false,
        isUpdatingExercise: false,
        isUpdatedExercises: false,
        isUpdatingExercises: false
    },
    workouts: {
        error: null,
        isAddedWorkout: false,
        isAddingWorkout: false,
        isDeletedWorkout: false,
        isDeletingWorkout: false,
        isRetrievedWorkouts: false,
        isRetrievingWorkouts: false,
        retrievedWorkouts: [],
    },
    login: {
        error: null,
        isRecoveredPassword: false,
        isRecoveringPassword: false,
        isLoggedIn: false,
        isLoggingIn: false,
        isLoggedOut: true,
        isLoggingOut: false,
        isRegistered: false,
        isRegistering: false,
        isDeleted: false,
        isDeleting: false
    },
    settings: {
        error: null,
        isAddedSettings: false,
        isAddingSettings: false,
        isRetrievedSettings: false,
        isRetrievingSettings: false,
        retrievedSettings: new SidemenuSettings,
        isUpdatedSettings: false,
        isUpdatingSettings: false
    }
}