import { ChangeEvent, FC, PropsWithChildren } from 'react'
import { CommentsBlock } from '../../comment-block/comment-block'
import styles from './question-area.module.scss'
import { Answer, Question, QuestionState, QuestionWithSelectedAnswer } from '../../../types/Test'

interface Props extends PropsWithChildren {
  questionData: Question
  questionIndex: number
  isTogglable?: boolean
}

export const QuestionArea: FC<Props> = ({ children, questionData, questionIndex, isTogglable }) => {
  const { answerList, answerOrder } = questionData

  return (
    <div className={styles.questionArea}>
      <section className={styles.questionSection}>
        <h2>Вопрос №{questionIndex + 1}</h2>
        <p className={styles.questionDescription}>{questionData.questionDescription}</p>
        <p className={styles.notice}>Выберите один вариант из списка</p>
        <form className={styles.answerForm} action='#'>
          <ul>
            {answerOrder.map((answerID) => {
              const { answerDescription } = answerList[answerID]
              const stringAnswerID = String(answerID)
              return (
                <li key={answerID}>
                  <input
                    type='radio'
                    id={stringAnswerID}
                    name='answer-selection'
                    value={answerID}
                    defaultChecked={false}
                  />
                  <label htmlFor={stringAnswerID}>{answerDescription}</label>
                </li>
              )
            })}
          </ul>
        </form>
        {children}
      </section>
      {/* <CommentsBlock questionID={questionData.questionID} /> */}
    </div>
  )
}
