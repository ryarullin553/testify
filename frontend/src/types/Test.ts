import { UserInfo } from './UserInfo'

export type Answer = {
  answerID: number
  answerDescription: string
}

export type KnownAnswer = Answer & {
  isCorrect: boolean
}

export type LikeState = 'like' | 'dislike' | 'none'

export const enum QuestionStates {
  Pending,
  Changed,
  Submitted,
  Correct,
  Incorrect,
}

export type Question = {
  questionID: number
  testID: Test['testID']
  questionDescription: string
  questionAvatar: string | null
  questionType: 'Single choice'
  answerList: Record<number, Answer>
  answerOrder: number[]
  likesCount: number
  dislikesCount: number
  likeState: LikeState
}

export type QuestionWithCorrectAnswer = Question & {
  answerList: Record<number, KnownAnswer>
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
  questionAmount: number
  answerAmount: number
  correctAnswerAmount: number
}

export type Attempt = TestWithQuestions & {
  attemptID: number
  isComplete: boolean
  attemptResult: AttemptResult
  submittedAnswers: Record<Question['questionID'], number[]>
}

export type FinishedAttempt = Attempt & {
  attemptResult: AttemptResult
}
