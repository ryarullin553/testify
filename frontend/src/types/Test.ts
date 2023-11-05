import { UserInfo } from './UserInfo'

export type Answer = {
  answerID: number
  answerDescription: string
}

export type LikeState = 'like' | 'dislike' | 'none'

export const enum QuestionStates {
  Pending,
  Changed,
  Submitted,
  Correct,
  Incorrect,
}

export const enum QuestionTypes {
  SINGLE_CHOICE = 'Одиночный выбор',
  MULTIPLE_CHOICE = 'Множественный выбор',
  TEXT_INPUT = 'Ввод текста',
  MATCHING = 'Cоответствие',
  SEQUENCING = 'Последовательность',
}

export type Question = {
  questionID: number
  testID: Test['testID']
  questionDescription: string
  questionAvatar: string | null
  questionType: keyof typeof QuestionTypes
  answerList: Record<number, Answer>
  answerOrder: number[]
  likesCount: number
  dislikesCount: number
  likeState: LikeState
}

export type QuestionWithCorrectAnswer = Question & {
  correctAnswerIDs: number[]
}

export type Test = {
  testID: number
  testTitle: string
}

export type TestWithAvatar = Test & {
  testAvatar: string
  isPublished?: boolean
}

export type TestWithSettings = Test & {
  testSummary: string
  testAvatar: string
  testDescription: string
  isPublished: boolean
  hasComments: boolean
  hasQuestionPoints: boolean
  hasCorrectAnswers: boolean
  hasQuestionExplanation: boolean
}

export type TestWithDescription = Test & {
  testSummary: string
  testAvatar: string
  testDescription: string
  testRating: number
  testVotesCounter: number
  testCompletionCounter: number
  isFavorite: boolean
  authorName: UserInfo['userName']
  authorBio: UserInfo['userBio']
  authorAvatar: UserInfo['userAvatar']
  isInProgress?: boolean
  activeAttemptID?: Attempt['attemptID']
}

export type TestWithDescriptionList = {
  testList: Record<Test['testID'], TestWithDescription>
  testOrder: Test['testID'][]
}

export type TestWithQuestions = Test & {
  questionList: Record<number, Question>
  questionOrder: number[]
  isPublished: boolean
  hasQuestionPoints: boolean
  hasQuestionExplanation: boolean
}

export type TestWithCorrectAnswers = TestWithQuestions & {
  questionList: Record<number, QuestionWithCorrectAnswer>
}

export type AttemptResult = {
  attemptScore: number
  attemptTime: string
  finishDate: string
  questionCount: number
  answerCount: number
  correctAnswerCount: number
}

export type Attempt = TestWithQuestions & {
  attemptID: number
  isComplete: boolean
  attemptResult: AttemptResult
  submittedAnswers: Record<Question['questionID'], number[]>
}

export type Completion = AttemptResult & {
  attemptID: number
  userID: string
  userName: string
  userAvatar: string | null
  codeword: string
}

export type FinishedAttempt = Attempt & {
  attemptResult: AttemptResult
}

export type TestStats = Test & {
  createDate: string
  avgScore: number
  avgAnswers: number
  avgCorrectAnswers: number
  reviewsCount: number
  completionsCount: number
  testRating: number
}
