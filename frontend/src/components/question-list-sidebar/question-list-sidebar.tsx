import { FC, PropsWithChildren } from 'react'
import { Question, QuestionState, Test, TestWithQuestions } from '../../types/Test'
import styles from './question-list-sidebar.module.scss'

interface Props extends PropsWithChildren {
  testTitle: Test['testTitle']
  currentQuestionID: number
  questionList: Record<
    number,
    {
      questionID: Question['questionID']
      questionDescription: Question['questionDescription']
      questionState?: QuestionState
    }
  >
  questionOrder: TestWithQuestions['questionOrder']
  setCurrentQuestionIndex: (questionID: Question['questionID']) => void
}

export const QuestionListSidebar: FC<Props> = ({
  testTitle,
  currentQuestionID,
  questionList,
  questionOrder,
  setCurrentQuestionIndex,
  children,
}) => {
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
  let _questionList = { ...questionList }
  let _questionOrder = [...questionOrder]

  if (currentQuestionID < 0) {
    _questionList[-1] = {
      questionID: -1,
      questionDescription: 'Новый вопрос',
    }
    _questionOrder.push(-1)
  }

  return (
    <section className={styles.questionListSection}>
      <h2>{testTitle}</h2>
      <ol>
        {_questionOrder.map((x, i) => (
          <li key={_questionList[x].questionID} style={{ color: getQuestionColor(_questionList[x].questionState) }}>
            <button
              className={styles.selectQuestionButton}
              onClick={() => setCurrentQuestionIndex(i)}
              style={{ color: getQuestionColor(_questionList[x].questionState) }}>
              {_questionList[x].questionDescription}
            </button>
          </li>
        ))}
      </ol>
      {children}
    </section>
  )
}
