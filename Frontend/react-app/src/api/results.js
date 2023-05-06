import { api } from '../store';

const BASE_REQUEST = '/api/results/';

export const fetchAttemptAction = async (attemptID) => {
  const {data} = await api.get(`${BASE_REQUEST}${attemptID}`);
  return data;
}

export const createAttemptAction = async (testID) =>{
  const {data} = await api.post(BASE_REQUEST, {test: testID});
  return data;
}

// export const updateAttemptAction = async ()
