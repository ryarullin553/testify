import { api } from '../store'

const BASE_REQUEST = 'questions/'

export const createQuestionAction = async (newQuestionData) => {
  const { data } = await api.post(BASE_REQUEST, newQuestionData)
  const newID = data.id
  return newID
}

export const updateQuestionAction = async (questionID, newQuestionData) => {
  await api.patch(`${BASE_REQUEST}${questionID}/`, newQuestionData)
}

export const deleteQuestionAction = async (questionID) => {
  await api.delete(`${BASE_REQUEST}${questionID}/`)
}

export const generateAnswersAction = async (request) => {
  const { data } = await api.post(`${BASE_REQUEST}generated/`, request)
  return data
}

export const fetchQuestionLikesAction = async (questionID) => {
  const { data } = await api.get(`${BASE_REQUEST}${questionID}/likes/`)
  return data
}

export const fetchQuestionCommentsAction = async (questionID) => {
  const { data } = await api.get(`${BASE_REQUEST}${questionID}/comments/`)
  return data
}
