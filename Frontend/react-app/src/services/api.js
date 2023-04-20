import { getToken } from '../services/token';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

const BACKEND_URL = 'http://127.0.0.1:8000'
const REQUEST_TIMEOUT = 5000;

const StatusCodeMapping = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true,
}

export const createAPI = () => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config) => {
      const token = getToken();

      if (token && config.headers) {
        config.headers['Authorization'] = `Token ${token}`;
      }

      return config;
    },
  );

  return api;
}