import { dropToken, saveToken } from '../services/token'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setAuthorizationStatus, setError, setUserInfo } from './actions'
import { store } from '.'
import { TIMEOUT_SHOW_ERROR } from '../reusable/const'
import { AppDispatch, State } from '../types/State'
import { AxiosInstance } from 'axios'
import { AuthData } from '../types/AuthData'

export const clearErrorAction = createAsyncThunk('app/clearError', () => {
  setTimeout(() => store.dispatch(setError(null)), TIMEOUT_SHOW_ERROR)
})

export const checkAuthAction = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch
    state: State
    extra: AxiosInstance
  }
>('user/checkAuth', async (_arg, { dispatch, extra: api }) => {
  try {
    const { data } = await api.get('auth/users/me/')
    dispatch(setAuthorizationStatus(true))
    dispatch(setUserInfo(data))
  } catch {
    dropToken()
  }
})

export const loginAction = createAsyncThunk<
  void,
  AuthData,
  {
    dispatch: AppDispatch
    state: State
    extra: AxiosInstance
  }
>('user/login', async ({ email, password }, { dispatch, extra: api }) => {
  const { data } = await api.post('auth/token/login/', { email, password })
  saveToken(data.auth_token)
  dispatch(setAuthorizationStatus(true))
})

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch
    state: State
    extra: AxiosInstance
  }
>('user/logout', async (_arg, { dispatch, extra: api }) => {
  await api.post('auth/token/logout/')
  dropToken()
  dispatch(setAuthorizationStatus(false))
  dispatch(
    setUserInfo({
      userID: '',
      userName: '',
      email: '',
      userAvatar: '',
    })
  )
})
