import { FC } from 'react'
import styles from './question-controls.module.scss'
import { Button } from '../Button/Button'

interface Props {
  gotoNextQuestion: () => void
}

export const QuestionControls: FC<Props> = ({ gotoNextQuestion }) => {
  const handleNextClick = () => {
    gotoNextQuestion()
  }

  return (
    <div className={styles.questionControls}>
      <Button type={'submit'}>Ответить</Button>
      <Button type={'button'} onClick={handleNextClick}>
        Следующий вопрос
      </Button>
    </div>
  )
}
