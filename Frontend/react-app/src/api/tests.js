import { api } from '../store';

const BASE_REQUEST = '/api/tests/';

export const fetchUserTests = async () => {
  const {data} = await api.get(BASE_REQUEST);
  return data;
}

export const createTestAction = async (newTestData, config) => {
  const {data} = await api.post(BASE_REQUEST, newTestData, config);
  const newTestID = data.id;
  return newTestID;
}

export const editTestAction = async (testID, newTestData, config) => {
  await api.patch(`${BASE_REQUEST}${testID}/`, newTestData, config);
}

export const fetchTestDescriptionAction = async (testID) => {
  const {data} = await api.get(`${BASE_REQUEST}${testID}/`);
  return data;
}

export const fetchTestQuestionsAction = async (testID) => {
  const {data} = await api.get(`${BASE_REQUEST}${testID}/questions/`);
  return data;
}

export const fetchResultsAction = async (testID) => {
  const {data} = await api.get(`${BASE_REQUEST}${testID}/results/`);
  return data;
}
