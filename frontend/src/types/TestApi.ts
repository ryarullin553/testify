import {
  Test,
  TestWithQuestions,
  Question,
  QuestionWithCorrectAnswer,
  Answer,
  Attempt,
  TestWithDescription,
  QuestionTypes,
} from '@/types/Test'
import { UserInfo } from './UserInfo'

export type EditTestRequest = {
  title: string
  short_description: string
  description?: string
  image?: File
  is_published?: boolean
  has_points: boolean
  has_comments: boolean
  has_right_answers: boolean
  has_questions_explanation: boolean
}

export type CreateTestProps = {
  testTitle: string
  testSummary: string
  testDescription: string
  testAvatar: File | null
  hasPoints?: string
  hasComments?: string
  areCorrectAnswersShown?: string
  hasQuestionsExplanation?: string
}

export type EditTestProps = CreateTestProps & {
  testID: Test['testID']
}

export type EditQuestionRequest = {
  test: number
  content: string
  answer_choices: AnswerResponse[]
  right_answers: string[]
  type?: string
  points?: number
  explanation?: string
}

export interface CreateQuestionArgs {
  testID: Test['testID']
  questionDescription: string
  questionAvatar: string | null
  questionType: keyof typeof QuestionTypes
  answerList: Record<number, Answer>
  answerOrder: number[]
  correctAnswerIDs: number[]
  questionPoints?: number
}

export interface EditQuestionArgs extends CreateQuestionArgs {
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

export type AnswerResponse = {
  id: number
  content: string
}

export type QuestionResponse = {
  test: number
  id: number
  has_like: boolean | null
  type: keyof typeof QuestionTypes
  content: string
  answer_choices: AnswerResponse[]
  right_answers: string[]
  image: string | null
  likes_count: number
  dislikes_count: number
  points?: number
}

export type TestResponse = {
  id: number
  questions?: string
  user_name?: string
  user_image?: string
  user_info?: string
  in_bookmarks?: boolean
  passage_id?: boolean
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

export type ResultResponse = {
  score: number
  passage_time: string
  answers_count: number
  finished_time: string
  questions_count: number
  correct_answers_count: number
}

export type SelectedAnswerResponse = {
  id: number
  question: number
  content: string[]
}

export type AttemptResponse = {
  id: number
  answers: SelectedAnswerResponse[]
  test: Test['testID']
  test_data?: TestWithQuestionsResponse
  user_id: UserInfo['userID']
  result?: ResultResponse
}

export const transformAnswerResponse = (r: AnswerResponse) => ({
  answerID: r.id,
  answerDescription: r.content,
})

export const transformAttemptResult = (r: ResultResponse) => ({
  attemptScore: r.score,
  attemptTime: r.passage_time,
  finishDate: r.finished_time,
  questionCount: r.questions_count,
  answerCount: r.answers_count,
  correctAnswerCount: r.correct_answers_count,
})

export const transformAttemptResponse = (r: AttemptResponse) => ({
  attemptID: r.id,
  testID: r.test,
  testTitle: r.test_data?.title,
  isPublished: true,
  hasQuestionExplanation: r.test_data?.has_questions_explanation,
  hasQuestionPoints: r.test_data?.has_questions_explanation,
  questionList: r.test_data?.questions.reduce((acc: Record<number, Question>, x) => {
    acc[x.id] = transformQuestionResponse(x, r.id)
    return acc
  }, {}),
  questionOrder: r.test_data?.questions.map((x) => x.id),
  isComplete: Boolean(r.result),
  attemptResult: r.result ? transformAttemptResult(r.result) : null,
  submittedAnswers: r.answers?.reduce((acc: Record<number, number[]>, x) => {
    acc[x.question] = x.content.map(Number)
    return acc
  }, {}),
})

export const transformEditQuestionRequest = (r: CreateQuestionArgs): EditQuestionRequest => ({
  test: r.testID,
  content: r.questionDescription,
  answer_choices: r.answerOrder.map((id) => ({
    id: id,
    content: r.answerList[id].answerDescription,
  })),
  right_answers: r.correctAnswerIDs.map(String),
  type: r.questionType,
  points: r.questionPoints,
  explanation: undefined,
})

export const transformEditTestRequest = (r: CreateTestProps) => {
  const {
    testTitle,
    testSummary,
    testDescription,
    testAvatar,
    hasPoints,
    hasComments,
    hasQuestionsExplanation,
    areCorrectAnswersShown,
  } = r
  const formData = new FormData()
  formData.append('title', testTitle)
  formData.append('short_description', testSummary)
  formData.append('description', testDescription)
  formData.append('has_points', String(Boolean(hasPoints)))
  formData.append('has_comments', String(Boolean(hasComments)))
  formData.append('has_right_answers', String(Boolean(areCorrectAnswersShown)))
  formData.append('has_questions_explanation', String(Boolean(hasQuestionsExplanation)))
  if (testAvatar) formData.append('image', testAvatar)

  return formData
}

export const transformTestResponse = (r: TestResponse) => ({
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
  isInProgress: Boolean(r.passage_id),
  activeAttemptID: r.passage_id,
})

export const transformQuestionResponse = (r: QuestionResponse, testID?: number): QuestionWithCorrectAnswer => ({
  testID: r.test ?? testID,
  questionID: r.id,
  questionType: r.type,
  questionDescription: r.content,
  questionAvatar: r.image,
  answerList: r.answer_choices.reduce((acc: Record<number, Answer>, x) => {
    acc[x.id] = transformAnswerResponse(x)
    return acc
  }, {}),
  answerOrder: r.answer_choices.map((x) => x.id),
  likesCount: r.likes_count,
  dislikesCount: r.dislikes_count,
  likeState: r.has_like === true ? 'like' : r.has_like === false ? 'dislike' : 'none',
  questionPoints: r.points,
  correctAnswerIDs: r.right_answers?.map(Number),
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

export const transformTestListResponse = (r: TestResponse[]) => ({
  // Постараться найти тип
  testList: r.reduce((acc: Record<number, any>, x) => {
    acc[x.id] = transformTestResponse(x)
    return acc
  }, {}),
  testOrder: r.map((x) => x.id),
})
