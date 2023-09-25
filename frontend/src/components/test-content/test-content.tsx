'use client'

import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import styles from './test-content.module.scss'
import { useState } from 'react'
import { QuestionArea } from './question-area/question-area'
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button'
import { QuestionControls } from '../question-controls/question-controls'
import { useParams, useRouter } from 'next/navigation'
import { useFinishAttemptMutation, useGetActiveAtemptQuery } from '@/services/testCompletionApi'
import { useGetTestAttemptsQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'
import { skipToken } from '@reduxjs/toolkit/dist/query'

export const TestContent = () => {
  const router = useRouter()
  const params = useParams()
  const testID = Number(params.testID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const { data: attemptList } = useGetTestAttemptsQuery(testID)
  const activeAttemptID = attemptList?.at(0)?.attemptID
  const { data: attemptData } = useGetActiveAtemptQuery(activeAttemptID ?? skipToken)
  const [finishAttempt] = useFinishAttemptMutation()

  if (!attemptData) return <Spinner />

  const { testTitle, questionList, questionOrder, attemptID } = attemptData

  const currentQuestionID = questionOrder[currentQuestionIndex]
  const currentQuestionData = questionList[currentQuestionID]

  const gotoNextQuestion = () => setCurrentQuestionIndex((prevVal) => prevVal + 1)

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={testTitle}
        questionList={questionList}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        currentQuestionID={currentQuestionID}
        questionOrder={questionOrder}>
        <QuestionListSidebarButton label={'Завершить тест'} onClickAction={() => finishAttempt(attemptID)} condition />
      </QuestionListSidebar>
      <QuestionArea
        key={currentQuestionID}
        questionData={currentQuestionData}
        questionIndex={currentQuestionIndex}
        isTogglable>
        <QuestionControls questionData={currentQuestionData} gotoNextQuestion={gotoNextQuestion} />
      </QuestionArea>
    </main>
  )
}
