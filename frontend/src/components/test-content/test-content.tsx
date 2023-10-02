'use client'

import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import styles from './test-content.module.scss'
import { useEffect, useState } from 'react'
import { QuestionArea } from './question-area/question-area'
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button'
import { QuestionControls } from '../question-controls/question-controls'
import { useParams, useRouter } from 'next/navigation'
import { useFinishAttemptMutation } from '@/services/testCompletionApi'
import { useGetAttemptByIDQuery, useGetTestByIDQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { AppRoute } from '@/reusable/const'
import { Attempt } from '@/types/Test'

export const TestContent = () => {
  const router = useRouter()
  const params = useParams()
  const testID = Number(params.testID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [localSelectedAnswers, setLocalSelectedAnswers] = useState<Attempt['selectedAnswers']>()
  const { data: testInfo, isSuccess: isTestInfoSuccess } = useGetTestByIDQuery(testID)
  const { isInProgress, activeAttemptID } = testInfo ?? { isInProgress: false, activeAttemptID: null }
  const { data: attemptData, isSuccess: isAttemptDataSuccess } = useGetAttemptByIDQuery(activeAttemptID ?? skipToken)
  const [finishAttempt] = useFinishAttemptMutation()

  useEffect(() => {
    if (!isAttemptDataSuccess) return
    setLocalSelectedAnswers(attemptData.selectedAnswers)
  }, [isAttemptDataSuccess])

  if (!isTestInfoSuccess) return <Spinner />

  if (!isInProgress) router.replace(`${AppRoute.TestDescription}/${testID}`)

  if (!attemptData || !localSelectedAnswers) return <Spinner />

  const { testTitle, questionList, questionOrder, attemptID } = attemptData

  const currentQuestionID = questionOrder[currentQuestionIndex]
  const currentQuestionData = questionList[currentQuestionID]
  const currentSelectedAnswers = localSelectedAnswers[currentQuestionID]

  const gotoNextQuestion = () => setCurrentQuestionIndex((prevVal) => Math.min(prevVal + 1, questionOrder.length - 1))

  const handleFinishAttemptClick = async () => {
    await finishAttempt(attemptID)
    router.push(`${AppRoute.Results}/${attemptID}`)
  }

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={testTitle}
        questionList={questionList}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        questionOrder={questionOrder}>
        <QuestionListSidebarButton label={'Завершить тест'} onClickAction={handleFinishAttemptClick} condition />
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
    </main>
  )
}
