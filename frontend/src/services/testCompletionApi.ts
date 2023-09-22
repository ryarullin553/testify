import { TestWithQuestionsResponse, transformQuestionResponse } from '@/types/TestApi'
import { api } from './api'
import { Attempt, Question, Test, TestWithQuestions } from '@/types/Test'
import { UserInfo } from '@/types/UserInfo'

type AttemptResponse = {
  answers: []
  id: number
  test: Test['testID']
  test_data: TestWithQuestionsResponse
  user_id: UserInfo['userID']
}

const transformGetActiveAttemptResponse = (r: AttemptResponse): Attempt => ({
  attemptID: r.id,
  testID: r.test,
  testTitle: r.test_data.title,
  isPublished: true,
  hasQuestionExplanation: r.test_data.has_questions_explanation,
  hasQuestionPoints: r.test_data.has_questions_explanation,
  questionList: r.test_data.questions.reduce((acc: Record<number, Question>, x) => {
    acc[x.id] = transformQuestionResponse(x, r.id)
    return acc
  }, {}),
  questionOrder: r.test_data.questions.map((x) => x.id),
})

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
      transformResponse: transformGetActiveAttemptResponse,
    }),
  }),
})

export const { useGetActiveAtemptQuery, useStartAttemptMutation } = testCompletionApi
