import { ChangeEvent, FC, FormEvent, MutableRefObject, PropsWithChildren } from 'react'
import { CommentsBlock } from '../../comment-block/comment-block'
import styles from './question-area.module.scss'
import { Answer, Attempt, Question } from '../../../types/Test'
import { SubmitAnswerArgs, useSubmitAnswerMutation } from '@/services/testCompletionApi'

interface Props extends PropsWithChildren {
  questionData: Question
  questionIndex: number
  attemptID: Attempt['attemptID']
  selectedAnswers: number[]
  changeLocalAnswer: (newValue: number) => void
  submitAnswerAction: (submitAnswerArgs: SubmitAnswerArgs) => void
  isTogglable?: boolean
}

export const QuestionArea: FC<Props> = ({
  children,
  attemptID,
  questionData,
  selectedAnswers,
  questionIndex,
  changeLocalAnswer,
  submitAnswerAction,
  isTogglable,
}) => {
  const { testID, answerList, answerOrder, questionID, questionDescription } = questionData

  const handleChange = (evt: FormEvent<HTMLInputElement>) => {
    const newValue = Number(evt.currentTarget.value)
    changeLocalAnswer(newValue)
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const submitAnswerArgs: SubmitAnswerArgs = {
      attemptID,
      testID,
      questionID,
      submittedAnswers: [Number(formData.get('selectedAnswer'))],
    }
    submitAnswerAction(submitAnswerArgs)
  }

  return (
    <div className={styles.questionArea}>
      <section className={styles.questionSection}>
        <h2>Вопрос №{questionIndex + 1}</h2>
        <p className={styles.questionDescription}>{questionDescription}</p>
        <p className={styles.notice}>Выберите один вариант из списка</p>
        <form className={styles.answerForm} onSubmit={handleSubmit} action='#'>
          <ul>
            {answerOrder.map((answerID) => {
              const { answerDescription } = answerList[answerID]
              return (
                <li key={answerID}>
                  <input
                    type='radio'
                    id={`selectAnswer-${answerID}`}
                    name='selectedAnswer'
                    value={answerID}
                    defaultChecked={selectedAnswers?.includes(answerID) || false}
                    onChange={handleChange}
                    disabled={!isTogglable}
                  />
                  <label htmlFor={`selectAnswer-${answerID}`}>{answerDescription}</label>
                </li>
              )
            })}
          </ul>
          {children}
        </form>
      </section>
      <CommentsBlock questionID={questionID} />
    </div>
  )
}
