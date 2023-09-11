import { getToken } from '@/services/token'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type AuthState = {
  isUserLogged: boolean
  token: string | null
}

const token = getToken()

const initialState: AuthState = {
  isUserLogged: Boolean(token),
  token: token ?? null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    userLoggedIn: (state, { payload }: PayloadAction<AuthState['token']>) => {
      state.isUserLogged = true
      state.token = payload
    },
    userLoggedOut: (state) => {
      state.isUserLogged = false
      state.token = null
    }
  }
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions
