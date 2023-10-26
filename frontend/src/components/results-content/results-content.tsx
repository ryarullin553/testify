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
import { useGetAttemptByIDQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'
import { Button } from '../Button/Button'

export const ResultsContent: FC = () => {
  const params = useParams()
  const attemptID = Number(params.attemptID)
  const { data: attemptData } = useGetAttemptByIDQuery(attemptID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)

  if (!attemptData) return <Spinner />

  const { testID, testTitle, questionList, questionOrder, attemptResult, selectedAnswers } = attemptData

  const currentQuestionID = questionOrder[currentQuestionIndex]
  const currentQuestionData = questionList[currentQuestionID]
  const currentSelectedAnswers = selectedAnswers[currentQuestionID]

  const gotoNextQuestion = () => setCurrentQuestionIndex((prevVal) => Math.min(prevVal + 1, questionOrder.length - 1))

  return (
    <>
      <QuestionListSidebar
        testTitle={testTitle}
        questionList={questionList}
        questionOrder={questionOrder}
        setCurrentQuestionIndex={setCurrentQuestionIndex}>
        {currentQuestionIndex !== -1 && (
          <Button view={'sidebar'} type={'button'} onClick={() => setCurrentQuestionIndex(-1)}>
            К результатам
          </Button>
        )}
      </QuestionListSidebar>
      {currentQuestionIndex === -1 ? (
        <div>
          <ResultsArea testTitle={testTitle} results={attemptResult} />
          <ReviewsBlock testID={testID} hasCommentBlock />
        </div>
      ) : (
        <QuestionArea
          key={currentQuestionID}
          questionData={currentQuestionData}
          questionIndex={currentQuestionIndex}
          isTogglable={false}
          attemptID={attemptID}
          gotoNextQuestion={gotoNextQuestion}
          selectedAnswers={currentSelectedAnswers}
        />
      )}
    </>
  )
}
