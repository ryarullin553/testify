import { FC } from 'react'
import styles from './question-controls.module.scss'
import { Button } from '../Button/Button'

interface Props {
  gotoNextQuestion: () => void
  finishAttemptAction: () => void
  hasAnswerChanged?: boolean
  isTestComplete?: boolean
}

export const QuestionControls: FC<Props> = ({
  gotoNextQuestion,
  finishAttemptAction,
  isTestComplete,
  hasAnswerChanged,
}) => {
  const handleSecondaryButtonClick = () => {
    isTestComplete ? finishAttemptAction() : gotoNextQuestion()
  }

  const secondaryButtonLabel = isTestComplete ? 'Завершить тест' : 'Следующий вопрос'

  return (
    <div className={styles.questionControls}>
      <Button type={'submit'} disabled={!hasAnswerChanged}>
        Ответить
      </Button>
      <Button type={'button'} colorTheme={isTestComplete ? 'default' : 'inversed'} onClick={handleSecondaryButtonClick}>
        {secondaryButtonLabel}
      </Button>
    </div>
  )
}
