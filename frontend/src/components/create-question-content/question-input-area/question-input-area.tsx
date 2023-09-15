import { Question } from '@/types/Test'
import styles from './question-input-area.module.scss'
import { FC } from 'react'

interface Props {
  questionDescription: Question['questionDescription']
  currentQuestionIndex: number
}

export const QuestionInputArea: FC<Props> = ({ questionDescription, currentQuestionIndex }) => {
  return (
    <fieldset className={styles.questionArea}>
      <label>{`Вопрос ${currentQuestionIndex + 1}`}</label>
      <textarea
        name={'questionDescription'}
        id={'questionDescription'}
        placeholder={'Напишите ваш вопрос или условие задачи'}
        defaultValue={questionDescription}
      />
    </fieldset>
  )
}
