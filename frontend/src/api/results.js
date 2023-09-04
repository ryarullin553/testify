import { api } from '../store'

const BASE_REQUEST = 'results/'

export const fetchAttemptAction = async (attemptID) => {
  const { data } = await api.get(`${BASE_REQUEST}${attemptID}/`)
  return data
}

export const createAttemptAction = async (testID) => {
  const { data } = await api.post(BASE_REQUEST, { test: testID })
  return data
}

export const submitAttemptAction = async (attemptID) => {
  await api.patch(`${BASE_REQUEST}${attemptID}/`)
}
