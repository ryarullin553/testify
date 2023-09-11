'use client'

import { FC, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import styles from './create-question-content.module.scss'
import { CreateQuestionManager } from './create-question-manager/create-question-manager'
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button'
import { QuestionWithCorrectAnswer, TestWithQuestions } from '../../types/Test'
import { useParams, useRouter } from 'next/navigation'
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useGetTestWithQuestionsQuery,
  useUpdateQuestionMutation,
} from '@/services/testsApi'
import { Spinner } from '../Spinner/Spinner'

export const CreateQuestionContent: FC = () => {
  const router = useRouter()
  const params = useParams()
  const { testID } = params
  const { data: initialTestData, isSuccess: isGetTestSuccess } = useGetTestWithQuestionsQuery(Number(testID))
  const [createQuestion, { isSuccess: isCreateQuestionSuccess }] = useCreateQuestionMutation()
  const [updateQuestion, _] = useUpdateQuestionMutation()
  const [deleteQuestion, { isSuccess: isDeleteQuestionSuccess }] = useDeleteQuestionMutation()
  const [testState, setTestState] = useImmer<TestWithQuestions | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    if (isGetTestSuccess) {
      setTestState(initialTestData)
      if (initialTestData.questionIDs.length === 0) {
        actionQuestionAdd()
      }
    }
  }, [isGetTestSuccess])

  if (!testState || testState.questionIDs.length === 0) return <Spinner />

  const currentQuestionID = testState.questionIDs[currentQuestionIndex]

  const currentQuestionData = testState.questionList[currentQuestionID]

  const isLastQuestion = currentQuestionIndex === testState.questionIDs.length - 1

  const actionQuestionAdd = () => {
    const newQuestionID = Math.min(...testState.questionIDs, 0) - 1
    const questionAmount = testState.questionIDs.length
    setTestState((draft) => {
      draft!.questionList[newQuestionID] = {
        testID: Number(testID),
        questionID: newQuestionID,
        questionDescription: '',
        questionType: 'Single choice',
        questionAvatar: null,
        answerList: {
          0: '',
          1: '',
        },
        answerCount: 2,
      }
      draft!.questionIDs.push(newQuestionID)
    })
    setCurrentQuestionIndex(questionAmount)
  }

  const actionQuestionCreate = async (updatedQuestionData: QuestionWithCorrectAnswer) => {
    const newID = await createQuestion(updatedQuestionData).unwrap()
    if (isCreateQuestionSuccess) {
      setTestState((draft) => {
        draft!.questionList[currentQuestionID].questionID = newID
        draft!.questionIDs[currentQuestionIndex] = newID
      })
    }
  }

  const actionQuestionUpdate = async (updatedQuestionData: QuestionWithCorrectAnswer) => {
    await updateQuestion(updatedQuestionData)
  }

  const actionQuestionDelete = async () => {
    if (currentQuestionID > 0) {
      await deleteQuestion(currentQuestionID)
    }
    if (currentQuestionID < 0 || isDeleteQuestionSuccess) {
      setTestState((draft) => {
        delete draft!.questionList[currentQuestionID]
        draft!.questionIDs.splice(currentQuestionIndex, 1)
      })
    }
    setCurrentQuestionIndex(Math.min(currentQuestionIndex, testState.questionIDs.length - 1))
  }

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={testState.testTitle}
        questionList={testState.questionList}
        setCurrentQuestionIndex={setCurrentQuestionIndex}>
        <QuestionListSidebarButton key={1} label={'Новый вопрос'} onClickAction={actionQuestionAdd} condition={true} />
        <QuestionListSidebarButton
          key={2}
          label={'Опубликовать тест'}
          onClickAction={actionTestPublish}
          condition={!testState.isPublished}
        />
      </QuestionListSidebar>
      <CreateQuestionManager
        key={currentQuestionID}
        currentQuestionID={currentQuestionID}
        currentQuestionIndex={currentQuestionIndex}
        defaultQuestionData={currentQuestionData}
        actionQuestionUpdate={actionQuestionUpdate}
        actionQuestionSave={actionQuestionSave}
        isLastQuestion={isLastQuestion}
        actionQuestionAdd={actionQuestionAdd}
        actionQuestionDelete={actionQuestionDelete}
      />
    </main>
  )
}
