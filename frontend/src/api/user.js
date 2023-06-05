import { api } from '../store';

const BASE_REQUEST = 'users/';

export const fetchUserInfoAction = async (userID) => {
  const {data} = await api.get(`${BASE_REQUEST}${userID}/`);
  return data;
}
