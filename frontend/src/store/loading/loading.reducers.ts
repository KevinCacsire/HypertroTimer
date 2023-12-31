import { createReducer, on} from "@ngrx/store";
import { hide, show } from "./loading.actions";
import { LoadingState } from "./LoadingState";
import { AppInitialState } from "../AppInitalState";

const initialState = AppInitialState.loading;

const reducer = createReducer(
    initialState,
    on(show, () => {
        return { show: true };
    }),
    on(hide, () => {
        return { show: false };
    })
);

export function loadingReducer(state: LoadingState | undefined, action: any) {
    return reducer(state, action)
}