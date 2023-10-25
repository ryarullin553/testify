'use client'

import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import styles from './test-content.module.scss'
import { useState } from 'react'
import { QuestionArea } from './question-area/question-area'
import { QuestionControls } from '../question-controls/question-controls'
import { useParams, useRouter } from 'next/navigation'
import { useFinishAttemptMutation } from '@/services/testCompletionApi'
import { useGetAttemptByIDQuery, useGetTestByIDQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { AppRoute } from '@/reusable/const'
import { Button } from '../Button/Button'

export const TestContent = () => {
  const router = useRouter()
  const params = useParams()
  const testID = Number(params.testID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const { data: testInfo, isSuccess: isTestInfoSuccess } = useGetTestByIDQuery(testID)
  const { isInProgress, activeAttemptID } = testInfo ?? { isInProgress: false, activeAttemptID: null }
  const { data: attemptData, isSuccess: isAttemptDataSuccess } = useGetAttemptByIDQuery(activeAttemptID ?? skipToken)
  const [finishAttempt] = useFinishAttemptMutation()

  if (!isTestInfoSuccess) return <Spinner />

  // Исправит моргание при завершении теста
  if (!isInProgress && !attemptData) router.replace(`${AppRoute.TestDescription}/${testID}`)

  if (!attemptData) return <Spinner />

  const { testTitle, questionList, questionOrder, attemptID, selectedAnswers } = attemptData

  const currentQuestionID = questionOrder[currentQuestionIndex]
  const currentQuestionData = questionList[currentQuestionID]
  const currentSelectedAnswers = selectedAnswers[currentQuestionID]

  const gotoNextQuestion = () => setCurrentQuestionIndex((prevVal) => Math.min(prevVal + 1, questionOrder.length - 1))

  const handleFinishAttemptClick = async () => {
    await finishAttempt(attemptID)
    router.push(`${AppRoute.Results}/${attemptID}`)
  }

  return (
    <>
      <QuestionListSidebar
        testTitle={testTitle}
        questionList={questionList}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        questionOrder={questionOrder}>
        <Button view={'sidebar'} onClick={handleFinishAttemptClick}>
          Завершить тест
        </Button>
      </QuestionListSidebar>
      <QuestionArea
        key={currentQuestionID}
        questionData={currentQuestionData}
        questionIndex={currentQuestionIndex}
        attemptID={attemptID}
        selectedAnswers={currentSelectedAnswers}
        gotoNextQuestion={gotoNextQuestion}
        isTogglable>
        <QuestionControls gotoNextQuestion={gotoNextQuestion} />
      </QuestionArea>
    </>
  )
}
