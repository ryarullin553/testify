import { Test, TestWithQuestions, Question, QuestionWithCorrectAnswer, Answer } from '@/types/Test'

export type EditTestRequest = {
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

export interface CreateTestProps {
  testTitle: string
  testSummary: string
  testDescription: string
  testAvatar: File | null
}

export interface EditTestProps extends CreateTestProps {
  testID: Test['testID']
}

export type EditQuestionRequest = {
  test: number
  content: string
  answer_choices: string[]
  right_answers: string[]
  type?: string
  points?: number
  explanation?: string
}

export interface CreateQuestionProps {
  testID: Test['testID']
  questionDescription: string
  questionAvatar: string | null
  questionType: 'Single choice'
  answerList: Record<number, Answer>
  answerOrder: number[]
}

export interface EditQuestionProps extends CreateQuestionProps {
  questionID: Question['questionID']
}

export type TestWithQuestionsResponse = {
  id: number
  questions: QuestionResponse[]
  title: string
  is_published: boolean
  has_points: boolean
  has_questions_explanation: boolean
}

export type QuestionResponse = {
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

export type TestResponse = {
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

export const transformEditQuestionRequest = (r: CreateQuestionProps): EditQuestionRequest => ({
  test: r.testID,
  content: r.questionDescription,
  answer_choices: Object.values(r.answerList).map((x) => x.answerDescription),
  right_answers: Object.values(r.answerList)
    .filter((x) => x.isCorrect)
    .map((x) => x.answerDescription),
  type: r.questionType,
  points: undefined,
  explanation: undefined,
})

export const transformEditTestRequest = (r: CreateTestProps): EditTestRequest => {
  const { testTitle, testSummary, testDescription, testAvatar } = r
  return {
    title: testTitle,
    short_description: testSummary,
    description: testDescription,
    image: testAvatar ?? undefined,
  }
}

export const transformGetTestResponse = (r: TestResponse) => ({
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
  isInProgress: r.has_passage,
})

export const transformQuestionResponse = (r: QuestionResponse, testID?: number): QuestionWithCorrectAnswer => ({
  testID: r.test ?? testID,
  questionID: r.id,
  questionType: r.type,
  questionDescription: r.content,
  questionAvatar: r.image,
  answerList: r.answer_choices.reduce((acc: Record<number, Answer>, x, i) => {
    acc[i] = { answerDescription: x, isCorrect: r.right_answers.includes(x) }
    return acc
  }, {}),
  answerOrder: r.answer_choices.map((_, i) => i),
  correctAnswerIDs: r.answer_choices
    .map((x, i) => [i, x] as const)
    .filter((x) => r.right_answers.includes(x[1]))
    .flatMap((x) => x[0]),
})

export const transformTestWithQuestionsResponse = (r: TestWithQuestionsResponse): TestWithQuestions => ({
  testID: r.id,
  testTitle: r.title,
  isPublished: r.is_published,
  hasQuestionExplanation: r.has_questions_explanation,
  hasQuestionPoints: r.has_points,
  questionList: r.questions.reduce((acc: Record<number, QuestionWithCorrectAnswer>, x) => {
    acc[x.id] = transformQuestionResponse(x, r.id)
    return acc
  }, {}),
  questionOrder: r.questions.map((x) => x.id),
})
