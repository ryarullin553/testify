import { ChangeEvent, FC, FormEvent, MutableRefObject, PropsWithChildren } from 'react'
import { CommentsBlock } from '../../comment-block/comment-block'
import styles from './question-area.module.scss'
import { Answer, Attempt, Question, QuestionState } from '../../../types/Test'
import { SubmitAnswerArgs, useSubmitAnswerMutation } from '@/services/testCompletionApi'

interface Props extends PropsWithChildren {
  questionData: Question
  questionIndex: number
  attemptID: Attempt['attemptID']
  selectedAnswers: number[]
  gotoNextQuestion: () => void
  isTogglable?: boolean
}

export const QuestionArea: FC<Props> = ({
  children,
  attemptID,
  questionData,
  selectedAnswers,
  questionIndex,
  gotoNextQuestion,
  isTogglable,
}) => {
  const { testID, answerList, answerOrder, questionID, questionDescription } = questionData
  const [submitAnswer] = useSubmitAnswerMutation()

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const submitAnswerArgs: SubmitAnswerArgs = {
      attemptID,
      testID,
      questionID,
      selectedAnswer: answerList[Number(formData.get('selectedAnswer'))],
    }
    await submitAnswer(submitAnswerArgs)
    gotoNextQuestion()
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
