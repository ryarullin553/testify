import { useGenerateAnswersMutation } from '@/services/generativeApi'
import styles from './AnswerGenerator.module.scss'
import { FC } from 'react'
import { Answer } from '@/types/Test'
import { Button } from '@/components/Button/Button'

interface Props {
  formRef: HTMLFormElement | null
  getFormData: (form: HTMLFormElement) => {
    answerList: Record<number, Answer>
    correctAnswerIDs: number[]
    questionDescription: string
  }
}

export const AnswerGenerator: FC<Props> = ({ formRef, getFormData }) => {
  const [generateAnswers] = useGenerateAnswersMutation()

  const handleGenerateAnswersClick = async () => {
    console.log(formRef)
    const { answerList, correctAnswerIDs, questionDescription } = getFormData(formRef)
    const correctAnswers = correctAnswerIDs.map((x) => answerList[x].answerDescription)
    const answers = Object.values(answerList).map((x) => x.answerDescription)
    const request = {
      questionDescription,
      numberToGenerate: 3,
      correctAnswers,
      answers,
    }
    generateAnswers(request)
  }

  return (
    <fieldset className={styles.generateAnswersForm}>
      <Button type={'button'} onClick={handleGenerateAnswersClick}>
        Сгенерировать варианты
      </Button>
      <input type={'number'} min={1} max={10} id={'generateAmount'} value={2} />
    </fieldset>
  )
}
