import { createAction, props } from "@ngrx/store";
import { Session } from "src/app/model/Session";

export const addSession = createAction("[Add Session]", props<{sessionName: string, weekday: string, splitId: string}>());
export const addSessionSuccess = createAction("[Add Session] Success");
export const addSessionFail = createAction("[Add Session] Fail", props<{error: any}>());
export const resetAddedSessionState = createAction('[Session] Reset addSession State');

export const deleteSession = createAction("[Delete Session]", props<{splitId: string, sessionId: string}>());
export const deleteSessionSuccess = createAction("[Delete Session] Success");
export const deleteSessionFail = createAction("[Delete Session] Fail", props<{error: any}>());
export const resetDeletedSessionState = createAction('[Session] Reset deleteSession State');

export const retrieveSessions = createAction("[Retrieve Sessions]", props<{splitId: string}>());
export const retrieveSessionsSuccess = createAction("[Retrieve Sessions] Success", props<{sessions: Session[]}>());
export const retrieveSessionsFail = createAction("[Retrieve Sessions] Fail", props<{error: any}>());
export const resetRetrievedSessionsState = createAction('[Session] Reset retrieveSessions State');
export const resetRetrievedSessionsData = createAction('[Session] Reset retrieveSessions Data');

export const updateSession = createAction("[Update Session]", props<{sessionName: string, weekday: string, splitId: string, sessionId: string}>());
export const updateSessionSuccess = createAction("[Update Session] Success");
export const updateSessionFail = createAction("[Update Session] Fail", props<{error: any}>());
export const resetUpdatedSessionState = createAction('[Session] Reset updateSession State');