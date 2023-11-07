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
import { AnswerArea } from './AnswerArea/AnswerArea'

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
        localAnswers: { ...submittedAnswers },
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
  const selectedAnswers = attemptState.localAnswers[currentQuestionID]
  const hasAnswerChanged = questionStates[currentQuestionID] === QuestionStates.Changed
  const isTestComplete = !Boolean(questionOrder.find((x) => questionStates[x] !== QuestionStates.Submitted))

  const changeLocalAnswer = (newValue: number[]) => {
    setAttemptState((prevState) => {
      const newState = { ...prevState }
      newState.localAnswers[currentQuestionID] = newValue
      newState.questionStates[currentQuestionID] = QuestionStates.Changed
      return newState
    })
  }

  const gotoNextQuestion = () =>
    setCurrentQuestionIndex((prevVal) => {
      const relativeOrder = questionOrder.slice(prevVal + 1).concat(questionOrder.slice(0, prevVal + 1))
      const nextID = relativeOrder.find((x) => questionStates[x] !== QuestionStates.Submitted) ?? currentQuestionID
      const nextIndex = questionOrder.findIndex((x) => x === relativeOrder.find((y) => y === nextID))
      return nextIndex
    })

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

  const finishAttemptAction = async () => {
    await finishAttempt(attemptID)
      .unwrap()
      .then(() => router.push(`${AppRoute.Results}/${attemptID}`))
  }

  return (
    <>
      <QuestionListSidebar
        testTitle={testTitle}
        questionList={questionList}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        questionOrder={questionOrder}
        questionStates={questionStates}
        currentQuestionIndex={currentQuestionIndex}>
        <Button view={'sidebar'} onClick={finishAttemptAction}>
          Завершить тест
        </Button>
      </QuestionListSidebar>
      <QuestionArea key={currentQuestionID} questionData={currentQuestionData} questionIndex={currentQuestionIndex}>
        <AnswerArea
          attemptID={attemptID}
          questionData={currentQuestionData}
          selectedAnswers={selectedAnswers}
          changeLocalAnswer={changeLocalAnswer}
          submitAnswerAction={submitAnswerAction}
          isTogglable>
          <QuestionControls
            gotoNextQuestion={gotoNextQuestion}
            isTestComplete={isTestComplete}
            finishAttemptAction={finishAttemptAction}
            hasAnswerChanged={hasAnswerChanged}
          />
        </AnswerArea>
      </QuestionArea>
    </>
  )
}
