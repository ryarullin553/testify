import { getToken } from '@/services/token'
import { UserInfo } from '@/types/UserInfo'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BACKEND_URL = 'http://127.0.0.1:8000/api/'
const REQUEST_TIMEOUT = 5000

type UserInfoResponse = {
  id: string
  username: string
  email: string
  image: string | null
  info: string
  created: string
}

type UserLoginResponse = {
  auth_token: string
}

type Token = string

type UserLoginRequest = {
  email: string
  password: string
}

const transformUserInfo = (response: UserInfoResponse): UserInfo => {
  const { id, username, email, image, info, created } = response
  return {
    userID: id,
    userName: username,
    userAvatar: image,
    userEmail: email,
    userInfo: info,
    accountDateCreated: new Date(created)
  }
}

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
    timeout: REQUEST_TIMEOUT
  }),
  endpoints: (builder) => ({
    getUserData: builder.query<UserInfo, void>({
      query: () => 'auth/users/me/',
      transformResponse: transformUserInfo,
      providesTags: ['UserAuth']
    }),
    loginUser: builder.mutation<Token, UserLoginRequest>({
      query: (credentials) => ({
        url: 'auth/token/login/',
        method: 'POST',
        body: credentials
      }),
      transformResponse: (response: UserLoginResponse) => response.auth_token,
    })
  })
})

export const { useGetUserDataQuery, useLoginUserMutation } = api
