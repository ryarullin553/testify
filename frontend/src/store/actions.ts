import { createAction } from '@reduxjs/toolkit';
import { SelfInfo } from '../types/UserInfo';

export const setUserInfo = createAction<SelfInfo>('user/setUserInfo');

export const setAuthorizationStatus = createAction<boolean>('authorization/setStatus');

export const setAuthorizationToken = createAction<string>('authorization/setToken');

export const setError = createAction<string | null>('app/setError');
