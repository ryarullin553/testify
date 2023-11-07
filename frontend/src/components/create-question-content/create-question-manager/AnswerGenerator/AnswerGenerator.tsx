import styles from './AnswerGenerator.module.scss'
import { FC } from 'react'

interface Props {
  handleGenerateAnswersClick: () => void
}

export const AnswerGenerator: FC<Props> = ({ handleGenerateAnswersClick }) => {
  return (
    <fieldset className={styles.generateAnswersForm}>
      <button type={'button'} onClick={handleGenerateAnswersClick}>
        Сгенерировать варианты
      </button>
      <input type='number' min={1} max={10} id='generateAmount' value={2} />
    </fieldset>
  )
}
