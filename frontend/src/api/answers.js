import { api } from '../store';

const BASE_REQUEST = 'answers/';

export const submitAnswerAction = async (newAnswerData) => {
  const {data} = await api.post(BASE_REQUEST, newAnswerData);
  return data;
}

export const updateAnswerAction = async (dbEntry, newAnswerData) => {
  await api.patch(`${BASE_REQUEST}${dbEntry}/`, newAnswerData);
}
