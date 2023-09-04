import { api } from '../store'

const BASE_REQUEST = 'comments/'

export const submitCommentAction = async (newCommentData) => {
  await api.post(BASE_REQUEST, newCommentData)
}
