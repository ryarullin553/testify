import { api } from '../store';

const BASE_REQUEST = 'bookmarks/';

export const addBookmarkAction = async (testID) => {
  await api.post(BASE_REQUEST, {test: testID});
}
