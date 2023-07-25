import { State } from "../types/State";

export const selectUserInfo = (state: State) => (state.userInfo);

export const selectAuthorizationStatus = (state: State) => (state.authorizationStatus);

export const selectErrorMessage = (state: State) => (state.error);
