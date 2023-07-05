import { store } from "../store";

export type State = {
  error: string | null,
  authorizationStatus: boolean,
  userInfo: {
    id: string,
    username: string,
    email: string,
    avatar: string,
  },
}

export type AppDispatch = typeof store.dispatch;
