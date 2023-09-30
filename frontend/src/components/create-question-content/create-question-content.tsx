'use client'

import { FC, useState } from 'react'
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import styles from './create-question-content.module.scss'
import { CreateQuestionManager } from './create-question-manager/create-question-manager'
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button'
import { useParams } from 'next/navigation'
import {
  useDeleteQuestionMutation,
  useGetTestWithQuestionsQuery,
  usePublishTestMutation,
} from '@/services/testCreationApi'
import { Spinner } from '../Spinner/Spinner'
import { Answer, QuestionWithCorrectAnswer } from '@/types/Test'

export const CreateQuestionContent: FC = () => {
  const params = useParams()
  const testID = Number(params.testID)
  const [publishTest] = usePublishTestMutation()
  const [deleteQuestion] = useDeleteQuestionMutation()
  const { data: initialTestData, isSuccess } = useGetTestWithQuestionsQuery(testID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [newQuestionData, setNewQuestionData] = useState<QuestionWithCorrectAnswer | null>(null)

  const blankAnswer: Answer = {
    answerDescription: '',
    isCorrect: false,
  }
  const blankQuestion: QuestionWithCorrectAnswer = {
    testID,
    questionDescription: '',
    questionAvatar: null,
    questionType: 'Single choice',
    questionID: -1,
    answerList: {
      0: blankAnswer,
      1: blankAnswer,
    },
    answerOrder: [0, 1],
    correctAnswerIDs: [0],
  }

  if (!isSuccess) return <Spinner />

  const { questionOrder, testTitle, questionList, isPublished } = initialTestData

  const _questionOrder = [...questionOrder]
  const _questionList = { ...questionList }

  if (newQuestionData) {
    _questionList[-1] = newQuestionData
    _questionOrder.push(-1)
  }

  const currentQuestionID = _questionOrder[currentQuestionIndex]
  const currentQuestionData = _questionList[currentQuestionID]

  const addNewQuestion = () => {
    setNewQuestionData(blankQuestion)
    setCurrentQuestionIndex(_questionOrder.length)
  }

  const handleDeleteQuestion = () => {
    const questionID = currentQuestionID
    setCurrentQuestionIndex(Math.min(questionOrder.length - 2, currentQuestionIndex))
    if (questionID === -1) {
      setNewQuestionData(null)
    } else {
      deleteQuestion({ questionID, testID })
    }
  }

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={testTitle}
        currentQuestionID={currentQuestionID}
        questionList={_questionList}
        questionOrder={_questionOrder}
        setCurrentQuestionIndex={setCurrentQuestionIndex}>
        <QuestionListSidebarButton
          key={1}
          label={'Новый вопрос'}
          onClickAction={addNewQuestion}
          condition={!newQuestionData}
        />
        <QuestionListSidebarButton
          key={2}
          label={'Опубликовать тест'}
          onClickAction={() => publishTest(testID)}
          condition={!isPublished}
        />
      </QuestionListSidebar>
      <CreateQuestionManager
        key={currentQuestionID}
        testID={Number(testID)}
        currentQuestionID={currentQuestionID}
        currentQuestionIndex={currentQuestionIndex}
        questionData={currentQuestionData}
        addNewQuestion={addNewQuestion}
        handleDeleteQuestion={handleDeleteQuestion}
      />
    </main>
  )
}
