import { Session } from "src/app/model/Session";

export interface LoggingSessionsState {
    error: any;

    isAddedSession: boolean;
    isAddingSession: boolean;

    isDeletedSession: boolean;
    isDeletingSession: boolean;

    isRetrievedSessions: boolean;
    isRetrievingSessions: boolean;
    retrievedSessions: Session[];
    
    isUpdatedSession: boolean;
    isUpdatingSession: boolean;
}