import { api } from '../store'

const BASE_REQUEST = 'tests/'

export const fetchUserCreatedTests = async () => {
  const { data } = await api.get(`${BASE_REQUEST}/created/`)
  return data
}

export const createTestAction = async (newTestData, config) => {
  const { data } = await api.post(BASE_REQUEST, newTestData, config)
  const newTestID = data.id
  return newTestID
}

export const editTestAction = async (testID, newTestData, config) => {
  await api.patch(`${BASE_REQUEST}${testID}/`, newTestData, config)
}

export const changeTestVisibilityAction = async (testID, isPublished) => {
  await api.patch(`${BASE_REQUEST}${testID}/`, { is_published: isPublished })
}

export const fetchTestInfoAction = async (testID) => {
  const { data } = await api.get(`${BASE_REQUEST}${testID}/`)
  return data
}

export const fetchTestDescriptionAction = async (testID) => {
  const { data } = await api.get(`${BASE_REQUEST}${testID}/description/`)
  return data
}

export const fetchTestQuestionsAction = async (testID) => {
  const { data } = await api.get(`${BASE_REQUEST}${testID}/questions/`)
  return data
}

export const fetchAttemptsAction = async (testID) => {
  const { data } = await api.get(`${BASE_REQUEST}${testID}/results/`)
  return data
}

export const fetchTestFeedbackAction = async (testID) => {
  const { data } = await api.get(`${BASE_REQUEST}${testID}/feedbacks/`)
  return data
}
