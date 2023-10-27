'use client'

import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import styles from './test-content.module.scss'
import { useEffect, useRef, useState } from 'react'
import { QuestionArea } from './question-area/question-area'
import { QuestionControls } from '../question-controls/question-controls'
import { useParams, useRouter } from 'next/navigation'
import { SubmitAnswerArgs, useFinishAttemptMutation, useSubmitAnswerMutation } from '@/services/testCompletionApi'
import { useGetAttemptByIDQuery, useGetTestByIDQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { AppRoute } from '@/reusable/const'
import { Button } from '../Button/Button'
import { Question, QuestionStates } from '@/types/Test'

export const TestContent = () => {
  const router = useRouter()
  const params = useParams()
  const testID = Number(params.testID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const { data: testInfo, isSuccess: isTestInfoSuccess } = useGetTestByIDQuery(testID)
  const { isInProgress, activeAttemptID } = testInfo ?? { isInProgress: false, activeAttemptID: null }
  const { data: attemptData, isSuccess: isAttemptDataSuccess } = useGetAttemptByIDQuery(activeAttemptID ?? skipToken)
  const [submitAnswer] = useSubmitAnswerMutation()
  const [finishAttempt] = useFinishAttemptMutation()

  interface AttemptState {
    questionStates: Record<Question['questionID'], QuestionStates>
    localAnswers: Record<Question['questionID'], number[]>
  }

  const [attemptState, setAttemptState] = useState<AttemptState>({ questionStates: {}, localAnswers: {} })

  useEffect(() => {
    if (isAttemptDataSuccess) {
      const { questionOrder, submittedAnswers } = attemptData
      setAttemptState({
        questionStates: questionOrder.reduce((acc: Record<Question['questionID'], QuestionStates>, x) => {
          acc[x] = !!submittedAnswers[x] ? QuestionStates.Submitted : QuestionStates.Pending
          return acc
        }, {}),
        localAnswers: {},
      })
    }
  }, [isAttemptDataSuccess])

  if (!isTestInfoSuccess) return <Spinner />

  // Исправит моргание при завершении теста
  if (!isInProgress && !attemptData) router.replace(`${AppRoute.TestDescription}/${testID}`)

  if (!attemptData) return <Spinner />

  const { testTitle, questionList, questionOrder, attemptID, submittedAnswers } = attemptData
  const { questionStates } = attemptState

  const currentQuestionID = questionOrder[currentQuestionIndex]
  const currentQuestionData = questionList[currentQuestionID]
  const currentSubmittedAnswers = submittedAnswers[currentQuestionID]
  const currentLocalAnswers = attemptState.localAnswers[currentQuestionID]
  const hasAnswerChanged = questionStates[currentQuestionID] === QuestionStates.Changed

  const selectedAnswers = currentLocalAnswers ?? currentSubmittedAnswers

  // работает только для одного ответа

  const changeLocalAnswer = (newValue: number) => {
    setAttemptState((prevState) => {
      const newState = { ...prevState }
      newState.localAnswers[currentQuestionID] = [newValue]
      newState.questionStates[currentQuestionID] = QuestionStates.Changed
      return newState
    })
  }

  const gotoNextQuestion = () => setCurrentQuestionIndex((prevVal) => Math.min(prevVal + 1, questionOrder.length - 1))

  const submitAnswerAction = async (submitAnswerArgs: SubmitAnswerArgs) => {
    await submitAnswer(submitAnswerArgs)
      .unwrap()
      .then(() => {
        setAttemptState((prevState) => {
          const newState = { ...prevState }
          newState.questionStates[currentQuestionID] = QuestionStates.Submitted
          return newState
        })
        gotoNextQuestion()
      })
  }

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
        questionOrder={questionOrder}
        questionStates={questionStates}>
        <Button view={'sidebar'} onClick={handleFinishAttemptClick}>
          Завершить тест
        </Button>
      </QuestionListSidebar>
      <QuestionArea
        key={currentQuestionID}
        questionData={currentQuestionData}
        questionIndex={currentQuestionIndex}
        attemptID={attemptID}
        selectedAnswers={selectedAnswers}
        changeLocalAnswer={changeLocalAnswer}
        submitAnswerAction={submitAnswerAction}
        isTogglable>
        <QuestionControls gotoNextQuestion={gotoNextQuestion} hasAnswerChanged={hasAnswerChanged} />
      </QuestionArea>
    </>
  )
}
