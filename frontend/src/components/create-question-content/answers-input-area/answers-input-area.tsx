import { FC, ChangeEvent, MouseEvent } from 'react'
import { AnswerTile } from './answer-tile/answer-tile'
import styles from './answers-input-area.module.scss'
import { Question, QuestionWithCorrectAnswer, Test } from '../../../types/Test'

interface Props {
  testID: Test['testID']
  questionID: Question['questionID']
  answerOrder: Question['answerOrder']
  actionAnswerDelete: (answerID: number) => void
}

export const AnswersInputArea: FC<Props> = ({ testID, questionID, answerOrder, actionAnswerDelete }) => {
  return (
    <fieldset className={styles.answersArea}>
      <legend>Ответы</legend>
      <p>Добавьте варианты ответа и отметьте правильный</p>
      <ul>
        {answerOrder.map((answerID) => (
          <AnswerTile
            key={answerID}
            testID={testID}
            questionID={questionID}
            answerID={answerID}
            actionAnswerDelete={actionAnswerDelete}
          />
        ))}
      </ul>
    </fieldset>
  )
}
