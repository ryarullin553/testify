import { Test, TestWithSettings, TestWithQuestions, Question, QuestionWithCorrectAnswer } from '@/types/Test'
import { api } from './api'
import {
  CreateTestProps,
  transformEditTestRequest,
  TestResponse,
  transformGetTestResponse,
  EditTestProps,
  transformTestWithQuestionsResponse,
  CreateQuestionProps,
  transformEditQuestionRequest,
  QuestionResponse,
  transformQuestionResponse,
  EditQuestionProps,
} from '@/types/TestApi'

export const testCreationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTest: builder.mutation<Test['testID'], CreateTestProps>({
      query: (newTestData) => ({
        url: 'tests/',
        method: 'POST',
        body: transformEditTestRequest(newTestData),
        formData: true,
      }),
      transformResponse: (r: TestResponse) => r.id,
    }),
    getTestSettingsByID: builder.query<TestWithSettings, Test['testID']>({
      query: (testID) => `tests/${testID}/config/`,
      transformResponse: (r: TestResponse) => transformGetTestResponse(r) as TestWithSettings,
    }),
    updateTestSettingsByID: builder.mutation<void, EditTestProps>({
      query: (editTestArgs) => ({
        url: `tests/${editTestArgs.testID}/`,
        method: 'PATCH',
        body: transformEditTestRequest(editTestArgs),
        formData: true,
      }),
    }),
    getTestWithQuestions: builder.query<TestWithQuestions, Test['testID']>({
      query: (testID) => `tests/${testID}/questions/`,
      transformResponse: transformTestWithQuestionsResponse,
    }),
    createQuestion: builder.mutation<QuestionWithCorrectAnswer, CreateQuestionProps>({
      query: (newQuestionData) => ({
        url: 'questions/',
        method: 'POST',
        body: transformEditQuestionRequest(newQuestionData),
      }),
      transformResponse: (r: QuestionResponse) => transformQuestionResponse(r),
      async onQueryStarted({ testID }, { dispatch, queryFulfilled }) {
        try {
          const { data: newQuestionData } = await queryFulfilled
          const patchResult = dispatch(
            testCreationApi.util.updateQueryData('getTestWithQuestions', testID, (draft) => {
              const { questionID } = newQuestionData
              draft.questionList[questionID] = newQuestionData
              draft.questionOrder.push(questionID)
            })
          )
        } catch {}
      },
    }),
    updateQuestion: builder.mutation<QuestionWithCorrectAnswer, EditQuestionProps>({
      query: (editQuestionArgs) => ({
        url: `questions/${editQuestionArgs.questionID}/`,
        method: 'PATCH',
        body: transformEditQuestionRequest(editQuestionArgs),
      }),
      transformResponse: (r: QuestionResponse) => transformQuestionResponse(r),
      async onQueryStarted({ testID }, { dispatch, queryFulfilled }) {
        try {
          const { data: newQuestionData } = await queryFulfilled
          const patchResult = dispatch(
            testCreationApi.util.updateQueryData('getTestWithQuestions', testID, (draft) => {
              const { questionID } = newQuestionData
              draft.questionList[questionID] = newQuestionData
            })
          )
        } catch {}
      },
    }),
    deleteQuestion: builder.mutation<void, { questionID: Question['questionID']; testID: Test['testID'] }>({
      query: ({ questionID }) => ({
        url: `questions/${questionID}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ testID, questionID }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          const patchResult = dispatch(
            testCreationApi.util.updateQueryData('getTestWithQuestions', testID, (draft) => {
              delete draft.questionList[questionID]
              draft.questionOrder = draft.questionOrder.filter((x) => x !== questionID)
            })
          )
        } catch {}
      },
    }),
    publishTest: builder.mutation<void, Test['testID']>({
      query: (testID) => ({
        url: `tests/${testID}/`,
        method: 'PATCH',
        body: { is_published: true },
      }),
      async onQueryStarted(testID, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          const patchResult = dispatch(
            testCreationApi.util.updateQueryData('getTestWithQuestions', testID, (draft) => {
              draft.isPublished = true
            })
          )
        } catch {}
      },
    }),
  }),
})

export const {
  useGetTestSettingsByIDQuery,
  useCreateTestMutation,
  useUpdateTestSettingsByIDMutation,
  useGetTestWithQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  usePublishTestMutation,
} = testCreationApi
