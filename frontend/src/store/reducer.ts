import { State } from '../types/State';
import { setAuthorizationStatus, setUserInfo, setError } from './actions';
import { createReducer } from '@reduxjs/toolkit';

const initialState: State = {
  error: null,
  authorizationStatus: false,
  userInfo: {
    userID: '',
    userName: '',
    email: '',
    userAvatar: '',
  },
}

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload
    })
    .addCase(setUserInfo, (state, action) => {
      state.userInfo = action.payload
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload
    })
})
