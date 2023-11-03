import { Attempt, Question, QuestionTypes } from '@/types/Test'
import styles from './AnswerArea.module.scss'
import { FC, FormEvent, PropsWithChildren } from 'react'
import { SubmitAnswerArgs } from '@/services/testCompletionApi'

interface Props extends PropsWithChildren {
  attemptID: Attempt['attemptID']
  questionData: Question
  selectedAnswers: number[]
  changeLocalAnswer?: (newValue: number[]) => void
  submitAnswerAction?: (submitAnswerArgs: SubmitAnswerArgs) => void
  isTogglable?: boolean
}

export const AnswerArea: FC<Props> = ({
  children,
  attemptID,
  questionData,
  selectedAnswers,
  changeLocalAnswer,
  submitAnswerAction,
  isTogglable,
}) => {
  const { testID, answerList, answerOrder, questionType, questionID } = questionData

  const handleChange = (evt: FormEvent<HTMLInputElement>) => {
    const { value, checked } = evt.currentTarget
    if (questionType === 'MULTIPLE_CHOICE' && selectedAnswers) {
      const isOn = Boolean(checked)
      if (isOn) {
        changeLocalAnswer!([...selectedAnswers, Number(value)])
      } else {
        changeLocalAnswer!([...selectedAnswers].filter((x) => x !== Number(value)))
      }
    } else {
      changeLocalAnswer!([Number(value)])
    }
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const submitAnswerArgs: SubmitAnswerArgs = {
      attemptID,
      testID,
      questionID,
      submittedAnswers: [...formData.getAll('answer-select').map(Number)],
    }
    submitAnswerAction!(submitAnswerArgs)
  }

  const tip = {
    SINGLE_CHOICE: 'Выберите один вариант из списка',
    MULTIPLE_CHOICE: 'Выберите один или несколько вариантов из списка',
    TEXT_INPUT: '',
    MATCHING: '',
    SEQUENCING: '',
  }

  const inputType = questionType === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'

  return (
    <>
      <p className={styles.notice}>{tip[questionType]}</p>
      <form className={styles.answerForm} onSubmit={handleSubmit} action='#'>
        <ul>
          {answerOrder.map((answerID) => {
            const { answerDescription } = answerList[answerID]
            return (
              <li key={answerID}>
                <label>
                  <input
                    type={inputType}
                    id={`${inputType}-${answerID}`}
                    name={'answer-select'}
                    value={answerID}
                    defaultChecked={selectedAnswers?.includes(answerID) || false}
                    onChange={handleChange}
                    disabled={!isTogglable}
                  />
                  {answerDescription}
                </label>
              </li>
            )
          })}
        </ul>
        {children}
      </form>
    </>
  )
}
