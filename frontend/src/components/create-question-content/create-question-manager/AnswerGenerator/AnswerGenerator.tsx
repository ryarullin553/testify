import { useGenerateAnswersMutation } from '@/services/generativeApi'
import styles from './AnswerGenerator.module.scss'
import { FC, MutableRefObject } from 'react'

interface Props {
  formRef: HTMLFormElement | null
}

export const AnswerGenerator: FC<Props> = ({ formRef }) => {
  const [generateAnswers] = useGenerateAnswersMutation()
  const handleGenerateAnswersClick = async () => {
    const request = {
      questionDescription: 'Сколько рогов у коровы',
      numberToGenerate: 3,
      correctAnswers: ['0'],
      answers: ['3', '1'],
    }
    generateAnswers(request)
  }

  return (
    <fieldset className={styles.generateAnswersForm}>
      <button type={'button'} onClick={handleGenerateAnswersClick}>
        Сгенерировать варианты
      </button>
      <input type={'number'} min={1} max={10} id={'generateAmount'} value={2} />
    </fieldset>
  )
}
