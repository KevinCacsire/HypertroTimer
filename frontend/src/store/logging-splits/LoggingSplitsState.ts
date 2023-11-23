import { Split } from "src/app/model/Split";

export interface LoggingSplitsState {
    error: any;

    isAddedSplit: boolean;
    isAddingSplit: boolean;

    isDeletedSplit: boolean;
    isDeletingSplit: boolean;

    isRetrievedSplits: boolean;
    isRetrievingSplits: boolean;
    retrievedSplits: Split[];
    
    isUpdatedSplit: boolean;
    isUpdatingSplit: boolean;
}