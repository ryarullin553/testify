import { createAction } from '@reduxjs/toolkit';

export const setUserInfo = createAction('user/setUserInfo');

export const setAuthorizationStatus = createAction('authorization/setStatus');

export const setAuthorizationToken = createAction('authorization/setToken');

export const setError = createAction('app/setError');
