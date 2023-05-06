import { api } from '../store';

const BASE_REQUEST = '/api/questions/';

export const createQuestionAction = async (newQuestionData) => {
  const {data} = await api.post(BASE_REQUEST, newQuestionData);
  return data;
}

export const updateQuestionAction = async (questionID, newQuestionData) => {
  await api.patch(`${BASE_REQUEST}${questionID}/`, newQuestionData);
}

export const deleteQuestionAction = async (questionID) => {
  await api.delete(`${BASE_REQUEST}${questionID}/`);
}
