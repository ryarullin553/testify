import { UserInfo, UserInfoExtended } from './UserInfo'

export interface Question {
  questionID: number
  testID: Test['testID']
  questionDescription: string
  questionAvatar: string | null
  questionType: 'Single choice'
  answerList: Record<number, string>
  answerCount: number
  questionState?: QuestionState
}

export interface QuestionWithCorrectAnswer extends Question {
  correctAnswerIDs: number[]
}

export interface QuestionWithSelectedAnswer extends Question {
  selectedAnswer: {
    answerID: number
    dbEntry: number
  }
}

export interface Test {
  testID: number
  testTitle: string
  testRating?: number
  testVotesCounter?: number
  testCompletionCounter?: number
  isFavorite?: boolean
  isInProgress?: boolean
}

export interface TestWithSettings extends Test {
  testSummary: string
  testAvatar: string
  testDescription: string
  isPublished: boolean
  hasComments: boolean
  hasQuestionPoints: boolean
  hasCorrectAnswers: boolean
  hasQuestionExplanation: boolean
}

export interface TestWithDescription extends Test {
  testSummary: string
  testAvatar: string
  testDescription: string
  testRating: number
  testVotesCounter: number
  testCompletionCounter: number
  isFavorite: boolean
  authorName: UserInfoExtended['userName']
  authorBio: UserInfoExtended['userBio']
  authorAvatar: UserInfoExtended['userAvatar']
}

export interface TestWithQuestions extends Test {
  questionList: Record<number, Question>
  questionIDs: number[]
  isPublished: boolean
  hasQuestionPoints: boolean
  hasQuestionExplanation: boolean
}

export interface Attempt extends TestWithQuestions {
  attemptID: number
  questionList: Record<number, QuestionWithSelectedAnswer>
  date?: Date
  score?: number
  isComplete?: boolean
}

export interface AttemptOverview extends Attempt {}

export interface AttemptComplete extends AttemptOverview {
  correctAnswers: number
  questionAmount: number
  attemptScore: number
  averageScore: number
  attemptTime: string
  totalAnswers: number
}

export enum QuestionState {
  NoAnswer = 'noAnswer',
  PendingAnswer = 'pendingAnswer',
  Submitted = 'submitted',
  Correct = 'correct',
  Incorrect = 'incorrect',
}
