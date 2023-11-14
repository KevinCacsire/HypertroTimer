import { createAction, props } from "@ngrx/store";
import { User } from "src/app/model/User";
import { UserRegister } from "src/app/model/UserRegister";

export const recoverPassword = createAction("[Recover password]", props<{email: string}>());
export const recoverPasswordSuccess = createAction("[Recover password] success");
export const recoverPasswordFail = createAction("[Recover password] fail", props<{error: any}>());
export const resetRecoveredPassword = createAction('[Recover password] Reset recoverPassword State');

export const login = createAction("[Login]", props<{email: string, password: string}>());
export const loginSuccess = createAction("[Login] success", props<{user: User}>());
export const loginFail = createAction("[Login] fail", props<{error: any}>());
export const resetLoggedIn = createAction('[Login] Reset login State');

export const logout = createAction("[Logout]");
export const logoutSuccess = createAction("[Logout] success");
export const logoutFail = createAction("[Logout] fail", props<{error: any}>());
export const resetLogout = createAction('[Logout] Reset logout State');

export const register = createAction('[Register]', props<{userRegister: UserRegister}>());
export const registerSuccess = createAction('[Register] success');
export const registerFail = createAction('[Register] fail', props<{error: any}>());
export const resetRegistered = createAction('[Register] Reset register State');

export const deleteAccount = createAction('[Delete Account]');
export const deleteAccountSuccess = createAction('[Delete Account] success');
export const deleteAccountFail = createAction('[Delete Account] fail', props<{error: any}>());
export const resetDeletedAccount = createAction('[Delete Account] Reset deleteAccount State');