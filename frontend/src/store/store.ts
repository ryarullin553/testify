import { configureStore } from '@reduxjs/toolkit'
import { createAPI } from '../services/api'
import { reducer } from './reducer'
import { api } from './api'
import { authSlice } from './authSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware)
})
