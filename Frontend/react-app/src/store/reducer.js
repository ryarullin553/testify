import { setAuthorizationStatus, setUserInfo, setAuthorizationToken } from './actions';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  authorizationStatus: false,
  userInfo: {
    id: '',
    username: '',
    email: '',
  },
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUserInfo, (state, action) => {
      state.userInfo = action.payload;
    });
});
