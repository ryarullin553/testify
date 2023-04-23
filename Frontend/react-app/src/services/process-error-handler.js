import { store } from "../store"
import { setError } from "../store/actions"
import { clearErrorAction } from "../store/api-actions";

export const processErrorHandle = (message) => {
  store.dispatch(setError(message));
  store.dispatch(clearErrorAction());
};
