import { AttemptResponse, transformAttemptResponse } from '@/types/TestApi'
import { api } from './api'
import { Answer, Attempt, Question, Test } from '@/types/Test'
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
  selectedAnswer: Answer
}

const transformSubmitAnswerRequest = (r: SubmitAnswerArgs): SubmitAnswerRequest => ({
  passage: r.attemptID,
  question: r.questionID,
  content: [r.selectedAnswer.answerDescription],
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
      invalidatesTags: ['Attempts'],
    }),
    submitAnswer: builder.mutation<void, SubmitAnswerArgs>({
      query: (submitAnswerArgs) => ({
        url: 'answers/',
        method: 'POST',
        body: transformSubmitAnswerRequest(submitAnswerArgs),
      }),
      onQueryStarted: async ({ testID, questionID, selectedAnswer }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          // треш (патчит ответы)
          dispatch(
            testCatalogApi.util.updateQueryData('getAttemptByID', testID, (draft) => {
              draft.selectedAnswers[questionID] = [
                draft.questionList[questionID].answerOrder.find(
                  (x) =>
                    draft.questionList[questionID].answerList[x].answerDescription === selectedAnswer.answerDescription
                )!,
              ]
            })
          )
        } catch {}
      },
    }),
  }),
})

export const { useStartAttemptMutation, useFinishAttemptMutation, useSubmitAnswerMutation } = testCompletionApi
