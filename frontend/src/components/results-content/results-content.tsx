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
import { Attempt, Question, QuestionState, QuestionWithSelectedAnswer } from '../../types/Test'
import { useGetAttemptByIDQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'

export const ResultsContent: FC = () => {
  const params = useParams()
  const attemptID = Number(params.attemptID)
  const { data: attemptData } = useGetAttemptByIDQuery(attemptID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)

  if (!attemptData) return <Spinner />

  const { testID, testTitle, questionList, questionOrder, attemptResult } = attemptData

  const currentQuestionID = questionOrder[currentQuestionIndex]
  const currentQuestionData = questionList[currentQuestionID]

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={testTitle}
        questionList={questionList}
        questionOrder={questionOrder}
        setCurrentQuestionIndex={setCurrentQuestionIndex}>
        <QuestionListSidebarButton
          label={'К результатам'}
          onClickAction={() => setCurrentQuestionIndex(-1)}
          condition
        />
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
        />
      )}
    </main>
  )
}
