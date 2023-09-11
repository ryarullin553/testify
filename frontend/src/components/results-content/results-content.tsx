'use client'

import { useParams } from 'next/navigation'
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button'
import { QuestionArea } from '../test-content/question-area/question-area'
import styles from './results-content.module.scss'
import { FC, useEffect, useState } from 'react'
import { fetchAttemptAction } from '../../api/results'
import { ResultsArea } from './results-area/results-area'
import { ReviewsBlock } from '../reviews-block/reviews-block'
import { Attempt, AttemptComplete, Question, QuestionState, QuestionWithSelectedAnswer } from '../../types/Test'

export const ResultsContent: FC = () => {
  const attemptID = Number(useParams().attemptID)
  const [results, setResults] = useState<AttemptComplete>()
  const [currentQuestionID, setCurrentQuestionID] = useState<Question['questionID']>(0)

  useEffect(() => {
    getResults(attemptID)
  }, [])

  const getResults = async (attemptID: Attempt['attemptID']) => {
    const data = await fetchAttemptAction(attemptID)
    const convertedData = convertDataStC(data)
    setResults(convertedData)
    setCurrentQuestionID(-1)
  }

  // Плохо
  const getCurrentQuestionData = (
    state: Attempt,
    currentQuestionID: Question['questionID']
  ): QuestionWithSelectedAnswer =>
    state.questionList.find((question) => question.questionID === currentQuestionID) || state.questionList[0]

  const getCurrentQuestionIndex = (state: Attempt, currentQuestionID: Question['questionID']) =>
    state.questionList.findIndex((question) => question.questionID === currentQuestionID)

  const convertDataStC = (data: any): AttemptComplete => {
    const convertedData: AttemptComplete = {
      testID: data.test,
      testTitle: data.passage.title,
      attemptID: data.id,
      questionList: data.passage.question_set.map((q: any) => ({
        questionID: q.id,
        questionDescription: q.content,
        questionState: !q.choiced_answer
          ? QuestionState.NoAnswer
          : q.choiced_answer.answer === q.answer_set.find((a: any) => a.is_true).id
          ? QuestionState.Correct
          : QuestionState.Incorrect,
        answerList: q.answer_set.map((a: any) => ({
          answerID: a.id,
          answerDescription: a.content,
        })),
        selectedAnswer: q.choiced_answer
          ? {
              answerID: q.choiced_answer.answer,
              dbEntry: q.choiced_answer.id,
            }
          : {},
      })),
      correctAnswers: data.total.correct_answers,
      questionAmount: data.total.questions_count,
      attemptScore: data.total.score,
      averageScore: parseInt(data.total.average_score),
      attemptTime: data.total.time,
      totalAnswers: data.total.total_answers,
    }
    return convertedData
  }

  if (!results) return <></>

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={results.testTitle}
        questionList={results.questionList}
        setCurrentQuestionID={setCurrentQuestionID}>
        <QuestionListSidebarButton label={'К результатам'} onClickAction={() => setCurrentQuestionID(-1)} condition />
      </QuestionListSidebar>
      {currentQuestionID === -1 ? (
        <div>
          <ResultsArea results={results} />
          <ReviewsBlock testID={results.testID} hasCommentBlock />
        </div>
      ) : (
        <QuestionArea
          questionData={getCurrentQuestionData(results, currentQuestionID)}
          questionIndex={getCurrentQuestionIndex(results, currentQuestionID)}
        />
      )}
    </main>
  )
}
