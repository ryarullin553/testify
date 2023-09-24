import { api } from './api'
import { UserInfo } from '@/types/UserInfo'

type UserDataResponse = {
  id: string
  username: string
  email: string
  image: string | null
  info: string
  created: string
}

export type UpdateUserDataRequest = {
  username: string
  email?: string
  info: string
  image?: File | null
}

const transformUserData = (response: UserDataResponse): UserInfo => {
  const { id, username, email, image, info, created } = response
  return {
    userID: id,
    userName: username,
    userAvatar: image,
    userEmail: email,
    userBio: info,
    accountDateCreated: created,
  }
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUserData: builder.query<UserInfo, void>({
      query: () => 'auth/users/me/',
      transformResponse: transformUserData,
      providesTags: ['UserAuth'],
    }),
    getUserData: builder.query<UserInfo, UserInfo['userID']>({
      query: (userID) => `auth/users/${userID}/`,
      transformResponse: transformUserData,
      providesTags: ['UserAuth'],
    }),
    updateUserData: builder.mutation<UserInfo, UpdateUserDataRequest>({
      query: (updatedInfo) => ({
        url: 'auth/users/me/',
        method: 'PATCH',
        body: updatedInfo,
        formData: true,
      }),
      transformResponse: transformUserData,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedUserInfo } = await queryFulfilled
          const patchResult = dispatch(
            usersApi.util.updateQueryData('getCurrentUserData', undefined, (draft) => {
              Object.assign(draft, updatedUserInfo)
            })
          )
        } catch {}
      },
    }),
  }),
})

export const { useGetCurrentUserDataQuery, useUpdateUserDataMutation, useGetUserDataQuery } = usersApi
