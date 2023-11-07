'use client'

import { FC, useState } from 'react'
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import styles from './create-question-content.module.scss'
import { CreateQuestionManager } from './create-question-manager/create-question-manager'
import { useParams } from 'next/navigation'
import {
  useDeleteQuestionMutation,
  useGetTestWithQuestionsQuery,
  usePublishTestMutation,
} from '@/services/testCreationApi'
import { Spinner } from '../Spinner/Spinner'
import { Answer, QuestionWithCorrectAnswer } from '@/types/Test'
import { Button } from '../Button/Button'

export const CreateQuestionContent: FC = () => {
  const params = useParams()
  const testID = Number(params.testID)
  const [publishTest] = usePublishTestMutation()
  const [deleteQuestion] = useDeleteQuestionMutation()
  const { data: initialTestData, isSuccess } = useGetTestWithQuestionsQuery(testID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [newQuestionData, setNewQuestionData] = useState<QuestionWithCorrectAnswer | null>(null)

  const blankAnswer = (id: number): Answer => ({
    answerID: id,
    answerDescription: '',
  })

  const blankQuestion: QuestionWithCorrectAnswer = {
    testID,
    questionDescription: '',
    questionAvatar: null,
    questionType: 'SINGLE_CHOICE',
    questionID: -1,
    answerList: {
      0: blankAnswer(0),
      1: blankAnswer(1),
    },
    answerOrder: [0, 1],
    correctAnswerIDs: [0],
    likesCount: 0,
    dislikesCount: 0,
    likeState: 'none',
  }

  if (!isSuccess) return <Spinner />

  const { questionOrder, testTitle, questionList, isPublished, hasQuestionPoints } = initialTestData

  const _questionOrder = [...questionOrder]
  const _questionList = { ...questionList }

  if (questionOrder.length === 0 && !newQuestionData) setNewQuestionData(blankQuestion)

  if (newQuestionData) {
    _questionList[-1] = newQuestionData
    _questionOrder.push(-1)
  }

  const hasQuestionSubmitted = questionOrder.length > 0
  const currentQuestionID = _questionOrder[currentQuestionIndex]
  const currentQuestionData = _questionList[currentQuestionID]

  const addNewQuestion = () => {
    setNewQuestionData(blankQuestion)
    setCurrentQuestionIndex(_questionOrder.length)
  }

  const handleQuestionDelete = () => {
    const questionID = currentQuestionID
    setCurrentQuestionIndex(Math.max(0, Math.min(_questionOrder.length - 2, currentQuestionIndex)))
    if (questionID === -1) {
      setNewQuestionData(null)
    } else {
      deleteQuestion({ questionID, testID })
    }
  }

  return (
    <>
      <QuestionListSidebar
        testTitle={testTitle}
        questionList={_questionList}
        questionOrder={_questionOrder}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        currentQuestionIndex={currentQuestionIndex}>
        {!newQuestionData && (
          <Button key={1} outerStyles={styles.sidebarButton} view={'sidebar'} onClick={addNewQuestion}>
            Новый вопрос
          </Button>
        )}
        {!isPublished && (
          <Button
            key={2}
            outerStyles={styles.sidebarButton}
            view={'sidebar'}
            onClick={() => publishTest(testID)}
            disabled={!hasQuestionSubmitted}>
            Опубликовать тест
          </Button>
        )}
      </QuestionListSidebar>
      <CreateQuestionManager
        key={currentQuestionID}
        testID={testID}
        hasQuestionPoints={hasQuestionPoints}
        currentQuestionID={currentQuestionID}
        currentQuestionIndex={currentQuestionIndex}
        questionData={currentQuestionData}
        addNewQuestion={addNewQuestion}
        handleQuestionDelete={handleQuestionDelete}
        hasQuestionSubmitted={!hasQuestionSubmitted}
      />
    </>
  )
}
