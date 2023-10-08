import { AttemptResponse, transformAttemptResponse } from '@/types/TestApi'
import { api } from './api'
import { Answer, Attempt, FinishedAttempt, Question, Test } from '@/types/Test'
import { testCatalogApi } from './testCatalogApi'

type SubmitAnswerRequest = {
  passage: Attempt['attemptID']
  question: Question['questionID']
  content: string[]
}

export type SubmitAnswerArgs = {
  attemptID: Attempt['attemptID']
  testID: Test['testID']
  questionID: Question['questionID']
  selectedAnswers: number[]
}

const transformSubmitAnswerRequest = (r: SubmitAnswerArgs): SubmitAnswerRequest => ({
  passage: r.attemptID,
  question: r.questionID,
  content: r.selectedAnswers.map(String),
})

export const testCompletionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    startAttempt: builder.mutation<Attempt, Test['testID']>({
      query: (testID) => ({
        url: `passages/`,
        method: 'POST',
        body: { test: testID },
      }),
      transformResponse: (r: AttemptResponse) => transformAttemptResponse(r) as Attempt,
      onQueryStarted: async (testID, { dispatch, queryFulfilled }) => {
        try {
          const { data: newAttemptData } = await queryFulfilled
          const { attemptID } = newAttemptData
          dispatch(
            testCatalogApi.util.updateQueryData('getTestByID', testID, (draft) => {
              draft.activeAttemptID = attemptID
              draft.isInProgress = true
            })
          )
          dispatch(testCatalogApi.util.upsertQueryData('getAttemptByID', attemptID, newAttemptData))
        } catch {}
      },
    }),
    finishAttempt: builder.mutation<void, Attempt['attemptID']>({
      query: (attemptID) => ({
        url: `passages/${attemptID}/`,
        method: 'PATCH',
      }),
      // Пропатчит attempt
      //
      // transformResponse: (r: AttemptResponse) => transformAttemptResponse(r) as FinishedAttempt,
      // onQueryStarted: async (attemptID, { dispatch, queryFulfilled }) => {
      //   try {
      //     const { data: attemptResult } = await queryFulfilled
      //     const { testID } = attemptResult
      //     dispatch(testCatalogApi.util.upsertQueryData('getAttemptByID', attemptID, attemptResult))
      //     dispatch(
      //       testCatalogApi.util.updateQueryData('getTestByID', testID, (draft) => {
      //         draft.activeAttemptID = undefined
      //         draft.isInProgress = false
      //       })
      //     )
      //     dispatch(
      //       testCatalogApi.util.updateQueryData('getTestAttempts', testID, (draft) => {
      //         draft[testID] = attemptResult
      //       })
      //     )
      //   } catch {}
      // },
      invalidatesTags: ['Attempts'],
    }),
    submitAnswer: builder.mutation<void, SubmitAnswerArgs>({
      query: (submitAnswerArgs) => ({
        url: 'answers/',
        method: 'POST',
        body: transformSubmitAnswerRequest(submitAnswerArgs),
      }),
      onQueryStarted: async ({ testID, questionID, selectedAnswers }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(
            testCatalogApi.util.updateQueryData('getAttemptByID', testID, (draft) => {
              draft.selectedAnswers[questionID] = selectedAnswers
            })
          )
        } catch {}
      },
    }),
  }),
})

export const { useStartAttemptMutation, useFinishAttemptMutation, useSubmitAnswerMutation } = testCompletionApi
