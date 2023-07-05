import { createAction } from '@reduxjs/toolkit';
import { UserInfo } from '../types/UserInfo';

export const setUserInfo = createAction<UserInfo>('user/setUserInfo');

export const setAuthorizationStatus = createAction<boolean>('authorization/setStatus');

export const setAuthorizationToken = createAction<string>('authorization/setToken');

export const setError = createAction<string | null>('app/setError');
