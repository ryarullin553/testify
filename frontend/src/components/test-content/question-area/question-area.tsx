import { FC, FormEvent, PropsWithChildren } from 'react'
import { CommentsBlock } from '../../comment-block/comment-block'
import styles from './question-area.module.scss'
import { Attempt, Question } from '../../../types/Test'
import { SubmitAnswerArgs } from '@/services/testCompletionApi'

interface Props extends PropsWithChildren {
  questionData: Question
  questionIndex: number
}

export const QuestionArea: FC<Props> = ({ children, questionData, questionIndex }) => {
  const { questionID, questionDescription } = questionData

  return (
    <div className={styles.questionArea}>
      <section className={styles.questionSection}>
        <h2>Вопрос №{questionIndex + 1}</h2>
        <p className={styles.questionDescription}>{questionDescription}</p>
        {children}
      </section>
      <CommentsBlock questionID={questionID} />
    </div>
  )
}
