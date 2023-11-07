'use client'

import { useParams } from 'next/navigation'
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import { QuestionArea } from '../test-content/question-area/question-area'
import styles from './results-content.module.scss'
import { FC, useEffect, useState } from 'react'
import { ResultsArea } from './results-area/results-area'
import { ReviewsBlock } from '../reviews-block/reviews-block'
import { useGetAttemptByIDQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'
import { Button } from '../Button/Button'
import { AnswerArea } from '../test-content/AnswerArea/AnswerArea'

export const ResultsContent: FC = () => {
  const params = useParams()
  const attemptID = Number(params.attemptID)
  const { data: attemptData } = useGetAttemptByIDQuery(attemptID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)

  if (!attemptData) return <Spinner />

  const { testID, testTitle, questionList, questionOrder, attemptResult, submittedAnswers } = attemptData

  const currentQuestionID = questionOrder[currentQuestionIndex]
  const currentQuestionData = questionList[currentQuestionID]
  const selectedAnswers = submittedAnswers[currentQuestionID]

  return (
    <>
      <QuestionListSidebar
        testTitle={testTitle}
        questionList={questionList}
        questionOrder={questionOrder}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        currentQuestionIndex={currentQuestionIndex}>
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
        <QuestionArea key={currentQuestionID} questionData={currentQuestionData} questionIndex={currentQuestionIndex}>
          <AnswerArea attemptID={attemptID} questionData={currentQuestionData} selectedAnswers={selectedAnswers} />
        </QuestionArea>
      )}
    </>
  )
}
