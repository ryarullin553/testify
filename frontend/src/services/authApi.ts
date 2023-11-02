import { api } from './api'

type LoginUserResponse = {
  auth_token: string
}

type Token = string

type LoginUserRequest = {
  email: string
  password: string
}

type CreateUserRequest = {
  email: string
  username: string
  password: string
}

type ResetPasswordRequest = {
  email: string
}

type ActivateUserRequest = {
  uid: string
  token: string
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<Token, LoginUserRequest>({
      query: (loginUserRequest) => ({
        url: 'auth/token/login/',
        method: 'POST',
        body: loginUserRequest,
      }),
      transformResponse: (response: LoginUserResponse) => response.auth_token,
      // onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
      //   try {
      //     await queryFulfilled
      //     dispatch(api.util.resetApiState())
      //   } catch {}
      // },
    }),
    createUser: builder.mutation<void, CreateUserRequest>({
      query: (createUserRequest) => ({
        url: 'users/',
        method: 'POST',
        body: createUserRequest,
      }),
    }),
    activateUser: builder.mutation<void, ActivateUserRequest>({
      query: (activateUserRequest) => ({
        url: 'users/activation/',
        method: 'POST',
        body: activateUserRequest,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (resetPasswordRequest) => ({
        url: 'users/reset_password/',
        method: 'POST',
        body: resetPasswordRequest,
      }),
    }),
  }),
})

export const { useLoginUserMutation, useCreateUserMutation, useResetPasswordMutation, useActivateUserMutation } =
  authApi
