import { FC, PropsWithChildren } from 'react'
import { Question, QuestionState, Test } from '../../types/Test'
import styles from './question-list-sidebar.module.scss'

interface Props extends PropsWithChildren {
  testTitle: Test['testTitle']
  questionList: Question[]
  setCurrentQuestionID: (questionID: Question['questionID']) => void
}

export const QuestionListSidebar: FC<Props> = ({ testTitle, questionList, setCurrentQuestionID, children }) => {
  const buttonLabel = (text: string) => {
    if (text.length === 0) {
      return 'Нет описания'
    } else {
      return text
    }
  }

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
        {questionList.map((question) => (
          <li key={question.questionID} style={{ color: getQuestionColor(question.questionState) }}>
            <button
              className={styles.selectQuestionButton}
              onClick={() => setCurrentQuestionID(question.questionID)}
              style={{ color: getQuestionColor(question.questionState) }}>
              {buttonLabel(question.questionDescription)}
            </button>
          </li>
        ))}
      </ol>
      {children}
    </section>
  )
}
