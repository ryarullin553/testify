'use client'

import { FC, useState } from 'react'
import { QuestionListSidebar } from '../question-list-sidebar/question-list-sidebar'
import styles from './create-question-content.module.scss'
import { CreateQuestionManager } from './create-question-manager/create-question-manager'
import { QuestionListSidebarButton } from '../question-list-sidebar/question-list-sidebar-button/question-list-sidebar-button'
import { useParams } from 'next/navigation'
import { useGetTestWithQuestionsQuery, usePublishTestMutation } from '@/services/testCreationApi'
import { Spinner } from '../Spinner/Spinner'

export const CreateQuestionContent: FC = () => {
  const params = useParams()
  const testID = Number(params.testID)
  const [publishTest] = usePublishTestMutation()
  const { data: initialTestData, isSuccess } = useGetTestWithQuestionsQuery(testID)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  if (!isSuccess) return <Spinner />

  const { questionOrder, testTitle, questionList, isPublished } = initialTestData

  const currentQuestionID = questionOrder[currentQuestionIndex] ?? -1
  const currentQuestionData = questionList[currentQuestionID] ?? null

  const actionQuestionAdd = () => {
    if (currentQuestionID === -1) {
      setCurrentQuestionIndex(questionOrder.length + 1)
    } else setCurrentQuestionIndex(questionOrder.length)
  }

  return (
    <main className={styles.pageMain}>
      <QuestionListSidebar
        testTitle={testTitle}
        currentQuestionID={currentQuestionID}
        questionList={questionList}
        questionOrder={questionOrder}
        setCurrentQuestionIndex={setCurrentQuestionIndex}>
        <QuestionListSidebarButton key={1} label={'Новый вопрос'} onClickAction={actionQuestionAdd} condition={true} />
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
        actionQuestionAdd={actionQuestionAdd}
      />
    </main>
  )
}
