import { getToken } from '@/services/token'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BACKEND_URL = 'http://127.0.0.1/api/'
const REQUEST_TIMEOUT = 5000

export const api = createApi({
  tagTypes: ['UserAuth'],
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: (headers) => {
      const token = getToken()
      if (token) {
        headers.set('Authorization', `Token ${token}`)
      }
      return headers
    },
    timeout: REQUEST_TIMEOUT,
  }),
  endpoints: () => ({}),
})
