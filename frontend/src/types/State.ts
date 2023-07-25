import { store } from "../store";

export type State = {
  error: string | null,
  authorizationStatus: boolean,
  userInfo: {
    userID: string,
    userName: string,
    email: string,
    userAvatar: string,
  },
}

export type AppDispatch = typeof store.dispatch;
