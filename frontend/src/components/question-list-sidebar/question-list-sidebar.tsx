import { FC, PropsWithChildren } from 'react'
import { Question, QuestionStates, Test, TestWithQuestions } from '../../types/Test'
import styles from './question-list-sidebar.module.scss'
import classNames from 'classnames'

interface Props extends PropsWithChildren {
  testTitle: Test['testTitle']
  questionList: TestWithQuestions['questionList']
  questionOrder: TestWithQuestions['questionOrder']
  questionStates?: Record<Question['questionID'], QuestionStates>
  setCurrentQuestionIndex: (questionID: Question['questionID']) => void
  currentQuestionIndex?: number
}

export const QuestionListSidebar: FC<Props> = ({
  testTitle,
  questionList,
  questionOrder,
  setCurrentQuestionIndex,
  questionStates = {},
  children,
  currentQuestionIndex,
}) => {
  const getQuestionColor = (questionState?: QuestionStates) => {
    switch (questionState) {
      case QuestionStates.Submitted:
        return '#A5A5A5'
      case QuestionStates.Changed:
        return 'yellow'
      case QuestionStates.Correct:
        return 'lightgreen'
      case QuestionStates.Incorrect:
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
          <li
            key={questionList[x].questionID}
            className={classNames(currentQuestionIndex === i && styles.active)}
            style={{ color: getQuestionColor(questionStates[x]) }}>
            <button
              className={styles.selectQuestionButton}
              onClick={() => setCurrentQuestionIndex(i)}
              style={{ color: getQuestionColor(questionStates[x]) }}>
              {questionList[x].questionDescription || 'Новый вопрос'}
            </button>
          </li>
        ))}
      </ol>
      {children}
    </section>
  )
}
