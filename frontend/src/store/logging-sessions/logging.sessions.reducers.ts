import { createReducer, on } from "@ngrx/store";
import { addSession, addSessionFail, addSessionSuccess, deleteSession, deleteSessionFail,
    deleteSessionSuccess, resetAddedSessionState,resetDeletedSessionState,resetRetrievedSessionsData,resetRetrievedSessionsState,
    resetUpdatedSessionState, retrieveSessions, retrieveSessionsFail, retrieveSessionsSuccess,
    updateSession, updateSessionFail, updateSessionSuccess } from "./logging.sessions.actions";
import { AppInitialState } from "../AppInitalState";
import { LoggingSessionsState } from "./LoggingSessionsState";

const initialState: LoggingSessionsState = AppInitialState.loggingSessions;

const reducer = createReducer(initialState,
    on(addSession, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedSession: false,
            isAddingSession: true
        };
    }),
    on(addSessionSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedSession: true,
            isAddingSession: false
        };
    }),
    on(addSessionFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isAddedSession: false,
            isAddingSession: false
        };
    }),
    on(resetAddedSessionState, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedSession: false
        };
    }),


    on(deleteSession, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedSession: false,
            isDeletingSession: true
        };
    }),
    on(deleteSessionSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedSession: true,
            isDeletingSession: false
        };
    }),
    on(deleteSessionFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isDeletedSession: false,
            isDeletingSession: false
        };
    }),
    on(resetDeletedSessionState, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedSession: false
        };
    }),


    on(retrieveSessions, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedSessions: false,
            isRetrievingSessions: true
        };
    }),
    on(retrieveSessionsSuccess, (currentState, {sessions}) => {
        return {
            ...currentState,
            error: null,
            isRetrievedSessions: true,
            isRetrievingSessions: false,
            retrievedSessions: sessions
        };
    }),
    on(retrieveSessionsFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isRetrievedSessions: false,
            isRetrievingSessions: false
        };
    }),
    on(resetRetrievedSessionsState, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedSessions: false
        };
    }),
    on(resetRetrievedSessionsData, currentState => {
        return {
            ...currentState,
            error: null,
            retrievedSessions: []
        };
    }),


    on(updateSession, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedSession: false,
            isUpdatingSession: true
        };
    }),
    on(updateSessionSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedSession: true,
            isUpdatingSession: false,
        };
    }),
    on(updateSessionFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isUpdatedSession: false,
            isUpdatingSession: false
        };
    }),
    on(resetUpdatedSessionState, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedSession: false
        };
    }),
)

export function loggingSessionsReducer(state: LoggingSessionsState | undefined, action: any) {
    return reducer(state, action);
}