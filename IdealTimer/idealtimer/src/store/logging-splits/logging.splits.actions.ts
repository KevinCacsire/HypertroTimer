import { createAction, props } from "@ngrx/store";
import { Split } from "src/app/model/Split";

export const addSplit = createAction("[Add Split]", props<{splitName: string, sessionsAmount: string}>());
export const addSplitSuccess = createAction("[Add Split] Success");
export const addSplitFail = createAction("[Add Split] Fail", props<{error: any}>());
export const resetAddedSplitState = createAction('[Split] Reset addSplit State');

export const deleteSplit = createAction("[Delete Split]", props<{splitId: string}>());
export const deleteSplitSuccess = createAction("[Delete Split] Success");
export const deleteSplitFail = createAction("[Delete Split] Fail", props<{error: any}>());
export const resetDeletedSplitState = createAction('[Split] Reset deleteSplit State');

export const retrieveSplits = createAction("[Retrieve Splits]");
export const retrieveSplitsSuccess = createAction("[Retrieve Splits] Success", props<{splits: Split[]}>());
export const retrieveSplitsFail = createAction("[Retrieve Splits] Fail", props<{error: any}>());
export const resetRetrievedSplitsState = createAction('[Split] Reset retrieveSplits State');
export const resetRetrievedSplitsData = createAction('[Split] Reset retrievedSplits Data');

export const updateSplit = createAction("[Update Split]", props<{splitName: string, sessionsAmount: string, splitId: string}>());
export const updateSplitSuccess = createAction("[Update Split] Success");
export const updateSplitFail = createAction("[Update Split] Fail", props<{error: any}>());
export const resetUpdatedSplitState = createAction('[Split] Reset updateSplit State');
