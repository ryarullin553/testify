import { Question } from '@/types/Test'
import styles from './question-input-area.module.scss'
import PictureIcon from './img/picture-icon.svg'
import { FC } from 'react'

interface Props {
  questionDescription: Question['questionDescription']
  currentQuestionIndex: number
}

export const QuestionInputArea: FC<Props> = ({ questionDescription, currentQuestionIndex }) => {
  return (
    <fieldset className={styles.questionArea}>
      <textarea
        name={'questionDescription'}
        id={'questionDescription'}
        placeholder={`Вопрос ${currentQuestionIndex + 1}`}
        defaultValue={questionDescription}
      />
      <label className={styles.imageInput}>
        <input type={'file'} />
        <PictureIcon />
      </label>
    </fieldset>
  )
}
