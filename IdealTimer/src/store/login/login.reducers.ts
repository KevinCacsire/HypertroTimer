import { createReducer, on } from "@ngrx/store";
import { LoginState } from "./LoginState";
import { login, loginFail, loginSuccess, recoverPassword, recoverPasswordSuccess,
    recoverPasswordFail, register, registerFail, registerSuccess, resetRecoveredPassword,
    resetLoggedIn, resetRegistered, resetLogout, logoutFail, logoutSuccess, logout,
    deleteAccount, 
    resetDeletedAccount,
    deleteAccountFail,
    deleteAccountSuccess} from "./login.actions";
import { AppInitialState } from "../AppInitalState";

const initialState: LoginState = AppInitialState.login;

const reducer = createReducer(initialState,
    on(recoverPassword, currentState => {
        return {
            ...currentState,
            error: null,
            isRecoveredPassword: false,
            isRecoveringPassword: true
        };
    }),
    on(recoverPasswordSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isRecoveredPassword: true,
            isRecoveringPassword: false
        };
    }),
    on(recoverPasswordFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isRecoveredPassword: false,
            isRecoveringPassword: false
        };
    }),
    on(resetRecoveredPassword, currentState => {
        return {
            ...currentState,
            error: null,
            isRecoveredPassword: false,
        }
    }),


    on(login, currentState => {
        return {
            ...currentState,
            error: null,
            isLoggedIn: false,
            isLoggingIn: true
        };
    }),
    on(loginSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isLoggedOut: false,
            isLoggedIn: true,
            isLoggingIn: false
        };
    }),
    on(loginFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isLoggedIn: false,
            isLoggingIn: false
        };
    }),
    on(resetLoggedIn, currentState => {
        return {
            ...currentState,
            error: null,
            isLoggedIn: false,
        }
    }),

    on(logout, currentState => {
        return {
            ...currentState,
            error: null,
            isLoggedOut: false,
            isLoggingOut: true
        };
    }),
    on(logoutSuccess, currentState => {
        return {
            ...currentState,
            error: null,
            isLoggedIn: false,
            isLoggedOut: true,
            isLoggingOut: false
        };
    }),
    on(logoutFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isLoggedOut: false,
            isLoggingOut: false
        };
    }),
    on(resetLogout, currentState => {
        return {
            ...currentState,
            error: null,
            isLoggedOut: false,
        }
    }),


    on(register, currentState => {
        return {
            ...currentState,
            error: null,
            isRegistered: false,
            isRegistering: true
        }
    }),
    on(registerSuccess, currentState => {
        return {
            ...currentState,
            isRegistered: true,
            isRegistering: false
        }
    }),
    on(registerFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isRegistered: false,
            isRegistering: false
        }
    }),
    on(resetRegistered, currentState => {
        return {
            ...currentState,
            error: null,
            isRegistered: false,
        }
    }),


    on(deleteAccount, currentState => {
        return {
            ...currentState,
            error: null,
            isDeleted: false,
            isDeleting: true
        }
    }),
    on(deleteAccountSuccess, currentState => {
        return {
            ...currentState,
            isDeleted: true,
            isDeleting: false
        }
    }),
    on(deleteAccountFail, (currentState, action) => {
        return {
            ...currentState,
            error: action.error,
            isDeleted: false,
            isDeleting: false
        }
    }),
    on(resetDeletedAccount, currentState => {
        return {
            ...currentState,
            error: null,
            isDeleted: false,
        }
    }),
)

export function loginReducer(state: LoginState | undefined, action: any) {
    return reducer(state, action);
}