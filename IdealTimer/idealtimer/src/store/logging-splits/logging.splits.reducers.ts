import { createReducer, on } from "@ngrx/store";
import { addSplit, addSplitFail, addSplitSuccess, deleteSplit, deleteSplitFail,
    deleteSplitSuccess, resetAddedSplitState,resetDeletedSplitState,resetRetrievedSplitsData,resetRetrievedSplitsState,
    resetUpdatedSplitState, retrieveSplits, retrieveSplitsFail, retrieveSplitsSuccess,
    updateSplit, updateSplitFail, updateSplitSuccess } from "./logging.splits.actions";
import { AppInitialState } from "../AppInitalState";
import { LoggingSplitsState } from "./LoggingSplitsState";

const initialState: LoggingSplitsState = AppInitialState.loggingSplits;

const reducer = createReducer(initialState,
    on(addSplit, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedSplit: false,
            isAddingSplit: true
        };
    }),
    on(addSplitSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedSplit: true,
            isAddingSplit: false
        };
    }),
    on(addSplitFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isAddedSplit: false,
            isAddingSplit: false
        };
    }),
    on(resetAddedSplitState, currentState => {
        return {
            ...currentState,
            error: null,
            isAddedSplit: false
        };
    }),


    on(deleteSplit, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedSplit: false,
            isDeletingSplit: true
        };
    }),
    on(deleteSplitSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedSplit: true,
            isDeletingSplit: false
        };
    }),
    on(deleteSplitFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isDeletedSplit: false,
            isDeletingSplit: false
        };
    }),
    on(resetDeletedSplitState, currentState => {
        return {
            ...currentState,
            error: null,
            isDeletedSplit: false
        };
    }),


    on(retrieveSplits, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedSplits: false,
            isRetrievingSplits: true
        };
    }),
    on(retrieveSplitsSuccess, (currentState, {splits}) => {
        return {
            ...currentState,
            error: null,
            isRetrievedSplits: true,
            isRetrievingSplits: false,
            retrievedSplits: splits
        };
    }),
    on(retrieveSplitsFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isRetrievedSplits: false,
            isRetrievingSplits: false
        };
    }),
    on(resetRetrievedSplitsState, currentState => {
        return {
            ...currentState,
            error: null,
            isRetrievedSplits: false
        };
    }),
    on(resetRetrievedSplitsData, currentState => {
        return {
            ...currentState,
            error: null,
            retrievedSplits: []
        };
    }),


    on(updateSplit, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedSplit: false,
            isUpdatingSplit: true
        };
    }),
    on(updateSplitSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedSplit: true,
            isUpdatingSplit: false,
        };
    }),
    on(updateSplitFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isUpdatedSplit: false,
            isUpdatingSplit: false
        };
    }),
    on(resetUpdatedSplitState, currentState => {
        return {
            ...currentState,
            error: null,
            isUpdatedSplit: false
        };
    }),
)

export function loggingSplitsReducer(state: LoggingSplitsState | undefined, action: any) {
    return reducer(state, action);
}