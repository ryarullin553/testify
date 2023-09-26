import { UserInfo } from './UserInfo'

export interface Answer {
  answerDescription: string
  isCorrect: boolean
}

export interface Question {
  questionID: number
  testID: Test['testID']
  questionDescription: string
  questionAvatar: string | null
  questionType: 'Single choice'
  answerList: Record<number, { answerDescription: string }>
  answerOrder: number[]
  questionState?: QuestionState
}

export interface QuestionWithCorrectAnswer extends Question {
  answerList: Record<number, Answer>
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
}

export interface TestWithAvatar extends Test {
  testAvatar: string
  isPublished?: boolean
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
  authorName: UserInfo['userName']
  authorBio: UserInfo['userBio']
  authorAvatar: UserInfo['userAvatar']
  isInProgress?: boolean
}

export interface TestWithQuestions extends Test {
  questionList: Record<number, Question>
  questionOrder: number[]
  isPublished: boolean
  hasQuestionPoints: boolean
  hasQuestionExplanation: boolean
}

export interface TestWithCorrectAnswers extends TestWithQuestions {
  questionList: Record<number, QuestionWithCorrectAnswer>
}

export interface AttemptResult {
  attemptScore: number
  attemptTime: string
  finishDate: string
  questionAmount: number
  answerAmount: number
  correctAnswerAmount: number
}

export interface Attempt extends TestWithQuestions {
  attemptID: number
  isComplete: boolean
  attemptResult: AttemptResult
}

export interface FinishedAttempt extends Attempt {
  attemptResult: AttemptResult
}

export enum QuestionState {
  NoAnswer = 'noAnswer',
  PendingAnswer = 'pendingAnswer',
  Submitted = 'submitted',
  Correct = 'correct',
  Incorrect = 'incorrect',
}
