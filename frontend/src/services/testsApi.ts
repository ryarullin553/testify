import {
  Test,
  TestWithSettings,
  TestWithDescription,
  TestWithQuestions,
  Question,
  QuestionWithCorrectAnswer,
} from '@/types/Test'
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

type EditQuestionRequest = {
  test: number
  content: string
  answer_choices: string[]
  right_answers: string[]
  type?: string
  points?: number
  explanation?: string
}

interface CreateQuestionProps {
  testID: Test['testID']
  questionDescription: string
  questionAvatar: string | null
  questionType: 'Single choice'
  answerList: Record<number, string>
  answerCount: number
  correctAnswerIDs: number[]
}

interface EditQuestionProps extends CreateQuestionProps {
  questionID: Question['questionID']
}

const transformEditQuestionRequest = (r: CreateQuestionProps): EditQuestionRequest => ({
  test: r.testID,
  content: r.questionDescription,
  answer_choices: Object.values(r.answerList),
  right_answers: r.correctAnswerIDs.map((x) => r.answerList[x]),
  type: r.questionType,
  points: undefined,
  explanation: undefined,
})

type TestConfigResponse = {
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

type TestWithQuestionsResponse = {
  id: number
  questions: QuestionResponse[]
  title: string
  is_published: boolean
  has_points: boolean
  has_questions_explanation: boolean
}

type QuestionResponse = {
  test: number
  id: number
  has_like: boolean
  type: 'Single choice'
  content: string
  answer_choices: string[]
  right_answers: string[]
  image: string | null
  likes_count: number
  dislikes_count: number
}

type TestResponse = {
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

const transformEditTestRequest = (r: CreateTestProps): EditTestRequest => {
  const { testTitle, testSummary, testDescription, testAvatar } = r
  return {
    title: testTitle,
    short_description: testSummary,
    description: testDescription,
    image: testAvatar ?? undefined,
  }
}

const transformGetTestResponse = (r: TestResponse) => ({
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

const transformQuestionResponse = (r: QuestionResponse, testID?: number): QuestionWithCorrectAnswer => ({
  testID: r.test ?? testID,
  questionID: r.id,
  questionType: r.type,
  questionDescription: r.content,
  questionAvatar: r.image,
  answerList: r.answer_choices.reduce((acc: Record<number, string>, x, i) => {
    acc[i] = x
    return acc
  }, {}),
  correctAnswerIDs: r.answer_choices
    .map((x, i) => [i, x] as const)
    .filter((x) => r.right_answers.includes(x[1]))
    .flatMap((x) => x[0]),
  answerCount: r.answer_choices.length,
})

const transformTestWithQuestionsResponse = (r: TestWithQuestionsResponse): TestWithQuestions => ({
  testID: r.id,
  testTitle: r.title,
  isPublished: r.is_published,
  hasQuestionExplanation: r.has_questions_explanation,
  hasQuestionPoints: r.has_points,
  questionList: r.questions.reduce((acc: Record<number, Question>, x) => {
    acc[x.id] = transformQuestionResponse(x, r.id)
    return acc
  }, {}),
  questionIDs: r.questions.map((x) => x.id),
})

export const testsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTest: builder.mutation<Test['testID'], CreateTestProps>({
      query: (newTestData) => ({
        url: 'tests/',
        method: 'POST',
        body: transformEditTestRequest(newTestData),
      }),
      transformResponse: (response: TestResponse) => response.id,
    }),
    getTestSettingsByID: builder.query<TestWithSettings, Test['testID']>({
      query: (testID) => `tests/${testID}/config/`,
      transformResponse: (response: TestConfigResponse) => transformGetTestResponse(response) as TestWithSettings,
    }),
    updateTestSettingsByID: builder.mutation<void, EditTestProps>({
      query: (editTestArgs) => ({
        url: `tests/${editTestArgs.testID}/`,
        method: 'PATCH',
        body: transformEditTestRequest(editTestArgs),
      }),
    }),
    getTestWithQuestions: builder.query<TestWithQuestions, Test['testID']>({
      query: (testID) => `tests/${testID}/questions/`,
      transformResponse: transformTestWithQuestionsResponse,
    }),
    createQuestion: builder.mutation<Question['questionID'], CreateQuestionProps>({
      query: (newQuestionData) => ({
        url: 'questions/',
        method: 'POST',
        body: transformEditQuestionRequest(newQuestionData),
      }),
      transformResponse: (response: QuestionResponse) => response.id,
    }),
    updateQuestion: builder.mutation<void, EditQuestionProps>({
      query: (editQuestionArgs) => ({
        url: `questions/${editQuestionArgs}/`,
        method: 'PATCH',
        body: transformEditQuestionRequest(editQuestionArgs),
      }),
    }),
    deleteQuestion: builder.mutation<void, Question['questionID']>({
      query: (questionID) => ({
        url: `questions/${questionID}`,
        method: 'DELETE',
      }),
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
} = testsApi
