import {
  Test,
  TestWithSettings,
  TestWithQuestions,
  Question,
  QuestionWithCorrectAnswer,
  TestWithCorrectAnswers,
  TestWithDescription,
} from '@/types/Test'
import { api } from './api'
import {
  CreateTestProps,
  transformEditTestRequest,
  TestResponse,
  transformTestResponse,
  EditTestProps,
  transformTestWithQuestionsResponse,
  CreateQuestionProps,
  transformEditQuestionRequest,
  QuestionResponse,
  transformQuestionResponse,
  EditQuestionProps,
  TestWithQuestionsResponse,
} from '@/types/TestApi'

export const testCreationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTest: builder.mutation<TestWithQuestions, CreateTestProps>({
      query: (newTestData) => ({
        url: 'tests/',
        method: 'POST',
        body: transformEditTestRequest(newTestData),
        formData: true,
      }),
      transformResponse: (r: TestWithQuestionsResponse) => transformTestWithQuestionsResponse(r) as TestWithQuestions,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data: testData } = await queryFulfilled
          dispatch(testCreationApi.util.upsertQueryData('getTestWithQuestions', testData.testID, testData))
        } catch {}
      },
      invalidatesTags: ['TestList'],
    }),
    getTestSettingsByID: builder.query<TestWithSettings, Test['testID']>({
      query: (testID) => `tests/${testID}/config/`,
      transformResponse: (r: TestResponse) => transformTestResponse(r) as TestWithSettings,
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
      onQueryStarted: async ({ testID }, { dispatch, queryFulfilled }) => {
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
      onQueryStarted: async ({ testID }, { dispatch, queryFulfilled }) => {
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
      onQueryStarted: async ({ testID, questionID }, { dispatch, queryFulfilled }) => {
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
      onQueryStarted: async (testID, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          const patchResult = dispatch(
            testCreationApi.util.updateQueryData('getTestWithQuestions', testID, (draft) => {
              draft.isPublished = true
            })
          )
        } catch {}
      },
      invalidatesTags: ['TestList'],
    }),
    hideTest: builder.mutation<void, Test['testID']>({
      query: (testID) => ({
        url: `tests/${testID}/`,
        method: 'PATCH',
        body: { is_published: false },
      }),
      onQueryStarted: async (testID, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          const patchResult = dispatch(
            testCreationApi.util.updateQueryData('getTestWithQuestions', testID, (draft) => {
              draft.isPublished = false
            })
          )
        } catch {}
      },
      invalidatesTags: ['TestList'],
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
  useHideTestMutation,
} = testCreationApi
