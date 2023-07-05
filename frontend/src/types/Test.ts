export interface Answer {
  answerID: number,
  answerDescription: string,
}

export interface Question {
  questionID: number,
  questionDescription: string,
  questionState: QuestionState,
  answerList: Answer[],
  selectedAnswer: number,
}
export interface Test {
  testID: number,
  testTitle: string,
  testSummary: string,
  testDescription: string,
  testAvatar: string,
  isPublished: boolean,
}

export interface TestWithQuestions extends Test {
  questionList: Question[],
}

export enum QuestionState {
  NoAnswer = 'noAnswer',
  PendingAnswer = 'pendingAnswer',
  Submitted = 'submitted',
  Correct = 'correct',
  Incorrect = 'incorrect',
}
