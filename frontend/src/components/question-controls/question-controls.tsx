import { FC } from 'react'
import styles from './question-controls.module.scss'
import { Button } from '../Button/Button'

interface Props {
  gotoNextQuestion: () => void
  hasAnswerChanged?: boolean
}

export const QuestionControls: FC<Props> = ({ gotoNextQuestion, hasAnswerChanged }) => {
  const handleNextClick = () => {
    gotoNextQuestion()
  }

  return (
    <div className={styles.questionControls}>
      <Button type={'submit'} disabled={!hasAnswerChanged}>
        Ответить
      </Button>
      <Button type={'button'} onClick={handleNextClick}>
        Следующий вопрос
      </Button>
    </div>
  )
}
