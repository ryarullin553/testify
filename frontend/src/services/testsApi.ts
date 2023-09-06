import { Test, TestWithConfigs, TestWithDescription } from '@/types/Test'
import { api } from './api'

type EditTestRequest = {
  title: string
  short_description: string
  description?: string
  image?: File
  is_published?: boolean
  has_points?: boolean
  has_comments?: boolean
  has_right_answers?: boolean
  has_questions_explanation?: boolean
}

interface CreateTestProps {
  testTitle: string
  testSummary: string
  testDescription: string
  testAvatar: File | null
}

interface EditTestProps extends CreateTestProps {
  testID: Test['testID']
}

const transformEditTestRequest = (request: CreateTestProps): EditTestRequest => {
  const { testTitle, testSummary, testDescription, testAvatar } = request
  return {
    title: testTitle,
    short_description: testSummary,
    description: testDescription,
    image: testAvatar ?? undefined,
  }
}

type GetTestConfigResponse = {
  id: number
  title: string
  short_description: string
  description: string
  image: string | null
  is_published: boolean
  has_points: boolean
  has_comments: boolean
  has_right_answers: boolean
  has_questions_explanation: boolean
}

type GetTestResponse = {
  id: number
  questions?: string
  user_name?: string
  user_image?: string
  user_info?: string
  in_bookmarks?: boolean
  has_passage?: boolean
  title?: string
  short_description?: string
  description?: string
  image?: string | null
  created?: string
  updated?: string
  is_published?: boolean
  has_points?: boolean
  has_comments?: boolean
  has_right_answers?: boolean
  has_questions_explanation?: boolean
  rating?: number
  feedbacks_count?: number
  results_count?: number
  avg_score?: string
  avg_answers_count?: string
  avg_correct_answers_count?: string
}

const transformGetTestResponse = (r: GetTestResponse) => ({
  testID: r.id,
  testTitle: r.title,
  testSummary: r.short_description,
  testDescription: r.description,
  testAvatar: r.image,
  isPublished: r.is_published,
  testRating: r.rating,
  testVotesCounter: r.feedbacks_count,
  testCompletionCounter: r.results_count,
  authorName: r.user_name,
  authorAvatar: r.user_image,
  authorBio: r.user_info,
  isFavorite: r.in_bookmarks,
  hasComments: r.has_comments,
  hasQuestionPoints: r.has_points,
  hasCorrectAnswers: r.has_right_answers,
  hasQuestionExplanation: r.has_questions_explanation,
})

export const testsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTest: builder.mutation<Test['testID'], CreateTestProps>({
      query: (newTestData) => ({
        url: 'tests/',
        method: 'POST',
        body: transformEditTestRequest(newTestData),
      }),
      transformResponse: (response: GetTestResponse) => response.id,
    }),
    getTestSettingsByID: builder.query<TestWithConfigs, Test['testID']>({
      query: (testID) => `tests/${testID}/config/`,
      transformResponse: (response: GetTestConfigResponse) => transformGetTestResponse(response) as TestWithConfigs,
    }),
    updateTestSettingsByID: builder.mutation<void, EditTestProps>({
      query: (editTestProps) => ({
        url: `tests/${editTestProps.testID}/`,
        method: 'PATCH',
        body: transformEditTestRequest(editTestProps),
      }),
    }),
  }),
})

export const { useGetTestSettingsByIDQuery, useCreateTestMutation, useUpdateTestSettingsByIDMutation } = testsApi
