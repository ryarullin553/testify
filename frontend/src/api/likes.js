import { api } from '../store/store'

const BASE_REQUEST = 'likes/'

export const addLikeAction = async (newLikeData) => {
  await api.post(BASE_REQUEST, newLikeData)
}

export const deleteLikeAction = async (questionID) => {
  await api.delete(`${BASE_REQUEST}${questionID}/`)
}

export const changeLikeAction = async (questionID, newLikeData) => {
  await api.patch(`${BASE_REQUEST}${questionID}/`, newLikeData)
}
