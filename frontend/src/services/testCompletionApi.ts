import { AttemptResponse, transformAttemptResponse } from '@/types/TestApi'
import { api } from './api'
import { Attempt, Test } from '@/types/Test'

export const testCompletionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    startAttempt: builder.mutation<void, Test['testID']>({
      query: (testID) => ({
        url: `passages/`,
        method: 'POST',
        body: { test: testID },
      }),
    }),
    getActiveAtempt: builder.query<Attempt, Test['testID']>({
      query: (testID) => `/passages/${testID}/`,
      transformResponse: (x: AttemptResponse) => transformAttemptResponse(x) as Attempt,
    }),
    finishAttempt: builder.mutation<void, Attempt['attemptID']>({
      query: (attemptID) => ({
        url: `passages/${attemptID}/`,
        method: 'PATCH',
      }),
    }),
  }),
})

export const { useGetActiveAtemptQuery, useStartAttemptMutation, useFinishAttemptMutation } = testCompletionApi
