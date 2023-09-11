import { api } from './api'

type UserLoginResponse = {
  auth_token: string
}

type Token = string

type UserLoginRequest = {
  email: string
  password: string
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<Token, UserLoginRequest>({
      query: (credentials) => ({
        url: 'auth/token/login/',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: UserLoginResponse) => response.auth_token,
    }),
  }),
})

export const { useLoginUserMutation } = authApi
