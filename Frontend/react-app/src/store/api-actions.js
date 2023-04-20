import { dropToken, saveToken } from '../services/token';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthorizationStatus, setUserInfo } from './actions';

export const checkAuthAction = createAsyncThunk(
  'user/checkAuth',
  async (_arg, {dispatch, extra: api}) => {
    try {
      const {data} = await api.get('/api/auth/users/me/');
      dispatch(setAuthorizationStatus(true));
      dispatch(setUserInfo(data));
    } catch {
      dropToken();
    }
  },
);

export const loginAction = createAsyncThunk(
  'user/login',
  async ({email, password}, {dispatch, extra: api}) => {
    const {data} = await api.post('/auth/token/login/', {email, password});
    saveToken(data.auth_token);
    dispatch(setAuthorizationStatus(true));
  },
);

export const logoutAction = createAsyncThunk(
  'user/logout',
  async (_arg, {dispatch, extra: api}) => {
    await api.post('/auth/token/logout/');
    dropToken();
    dispatch(setAuthorizationStatus(false));
    dispatch(setUserInfo({
      id: '',
      username: '',
      email: '',
    }));
  },
);
