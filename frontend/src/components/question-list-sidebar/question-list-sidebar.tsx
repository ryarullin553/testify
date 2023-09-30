import { FC, PropsWithChildren } from 'react'
import { Question, QuestionState, Test, TestWithQuestions } from '../../types/Test'
import styles from './question-list-sidebar.module.scss'

interface Props extends PropsWithChildren {
  testTitle: Test['testTitle']
  questionList: TestWithQuestions['questionList']
  questionOrder: TestWithQuestions['questionOrder']
  setCurrentQuestionIndex: (questionID: Question['questionID']) => void
}

export const QuestionListSidebar: FC<Props> = ({
  testTitle,
  questionList,
  questionOrder,
  setCurrentQuestionIndex,
  children,
}) => {
  const getQuestionColor = (questionState?: QuestionState) => {
    switch (questionState) {
      case QuestionState.Submitted:
        return '#A5A5A5'
      case QuestionState.PendingAnswer:
        return 'yellow'
      case QuestionState.Correct:
        return 'lightgreen'
      case QuestionState.Incorrect:
        return 'red'
      default:
        return ''
    }
  }

  return (
    <section className={styles.questionListSection}>
      <h2>{testTitle}</h2>
      <ol>
        {questionOrder.map((x, i) => (
          <li key={questionList[x].questionID} style={{ color: getQuestionColor(questionList[x].questionState) }}>
            <button
              className={styles.selectQuestionButton}
              onClick={() => setCurrentQuestionIndex(i)}
              style={{ color: getQuestionColor(questionList[x].questionState) }}>
              {questionList[x].questionDescription || 'Новый вопрос'}
            </button>
          </li>
        ))}
      </ol>
      {children}
    </section>
  )
}
