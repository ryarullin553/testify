import { FC, FormEvent, MouseEvent } from 'react'
import styles from './question-controls.module.scss'
import { Answer, Question, QuestionState, QuestionWithSelectedAnswer } from '../../types/Test'

interface Props {
  questionData: Question
  gotoNextQuestion: () => void
}

export const QuestionControls: FC<Props> = ({ questionData, gotoNextQuestion }) => {
  const handleNextClick = (evt: MouseEvent<HTMLButtonElement>) => {
    gotoNextQuestion()
  }

  return (
    <div className={styles.questionControls}>
      <button type={'submit'}>Ответить</button>
      <button type={'button'} onClick={handleNextClick}>
        Следующий вопрос
      </button>
    </div>
  )
}
