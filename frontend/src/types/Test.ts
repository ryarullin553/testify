import { UserInfo, UserInfoExtended } from './UserInfo'

export interface Answer {
  answerID: number
  answerDescription: string
}

export interface Question {
  questionID: number
  questionDescription: string
  questionState?: QuestionState
  answerList: Answer[]
  correctAnswerID?: number
  selectedAnswer?: {
    answerID: number
    dbEntry: number
  }
}

export interface QuestionWithCorrectAnswer extends Question {
  correctAnswerID: number
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
  isPublished?: boolean
  testSummary?: string
  testAvatar?: string
  testDescription?: string
  testRating?: number
  testVotesCounter?: number
  testCompletionCounter?: number
  isFavorite?: boolean
  isInProgress?: boolean
}

export interface TestWithAvatar extends Test {
  testAvatar: string
}

export interface TestWithSummary extends TestWithAvatar {
  testSummary: string
}

export interface TestWithDescription extends TestWithSummary {
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
  questionList: Question[]
}

export interface Attempt extends TestWithQuestions {
  attemptID: number
  questionList: QuestionWithSelectedAnswer[]
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
