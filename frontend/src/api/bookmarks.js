import { api } from '../store'

const BASE_REQUEST = 'bookmarks/'

export const addBookmarkAction = async (testID) => {
  await api.post(BASE_REQUEST, { test: testID })
}

export const deleteBookmarkAction = async (testID) => {
  await api.delete(`${BASE_REQUEST}${testID}/`)
}

export const fetchBookmarksAction = async () => {
  const { data } = await api.get(BASE_REQUEST)
  return data
}
