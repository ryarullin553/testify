import axios, { AxiosInstance } from 'axios';
import { StatusCodes } from 'http-status-codes';

const BACKEND_URL = 'http://127.0.0.1:8000/api'
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

  return api;
}
